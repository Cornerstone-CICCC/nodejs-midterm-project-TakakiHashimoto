import db from "../../config/db";
import { AuthedRequest } from "../../middleware/auth.middleware";
import { Response } from "express";
import { validateDate } from "../../utils/validateDate";
import {
  ALLOWED_PRIORITIES,
  ALLOWED_STATUSES,
  isPriority,
  isStatus,
} from "../../utils/constants";
import { type priorityType, type statusType } from "../../types/tasks.types";

// ########################## GET ALL THE TASKS ################################
async function getAllTasks(req: AuthedRequest, res: Response) {
  const userId = req.userId;
  try {
    const data = await db.query(
      "SELECT id, user_id, title, description, due_date, priority, status, subject FROM tasks where user_id = ($1)",
      [userId],
    );

    return res
      .status(200)
      .json({
        message: "Successfully Fetched all the tasks",
        tasks: data.rows,
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

// ############################# GETTING TASK BY ID ###########################
async function getTasksById(req: AuthedRequest, res: Response) {
  const userId = req.userId;
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(400).json({ error: "ID is missing" });
  }

  try {
    const data = await db.query(
      "SELECT id, user_id, title, description, due_date, priority, status, subject FROM tasks where user_id = ($1) AND id = ($2)",
      [userId, taskId],
    );

    if (data.rows.length === 0) {
      return res.status(404).json({ error: "No item found" });
    }

    return res
      .status(200)
      .json({ message: "Successfully fetch the task", task: data.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch a task" });
  }
}

// ####################### CREATE NEW TASK ###############################################
async function createNewTask(req: AuthedRequest, res: Response) {
  const userId = req.userId;
  const { title, description, due_date, priority, status, subject } = req.body;
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  // validating inputs
  if (due_date !== undefined) {
    if (due_date !== null && typeof due_date !== "string") {
      return res.status(400).json({ error: "due_date must be null or string" });
    }
    const isValideDate = validateDate(due_date);
    if (typeof due_date === "string" && !isValideDate) {
      return res
        .status(400)
        .json({ error: "Due Date needs to be YYYY-MM-DD format" });
    }
  }
  const validDes =
    typeof description === "string" && description.trim()
      ? description.trim()
      : null;

  const validSubject =
    typeof subject === "string" && subject.trim() ? subject.trim() : null;

  if (priority !== undefined) {
    if (typeof priority !== "string")
      return res.status(400).json({ error: "invlaid request" });

    const normalizedPriority = priority.trim().toLocaleLowerCase();
    if (!isPriority(normalizedPriority)) {
      return res.status(400).json({ error: "Invalid Request" });
    }
  }

  if (status !== undefined) {
    if (typeof status !== "string") {
      return res.status(400).json({ error: "Invalid Request" });
    }

    const normalizedStatus = status.trim().toLowerCase();
    if (!isStatus(normalizedStatus)) {
      return res
        .status(400)
        .json({ error: "Status must be todo, in-progress or done" });
    }
  }

  const normalizedPriority =
    priority !== undefined ? priority.trim().toLocaleLowerCase() : "medium";
  const normalizedStatus =
    status !== undefined ? status.trim().toLocaleLowerCase() : "todo";
  try {
    const data = await db.query(
      "INSERT INTO tasks (user_id, title, description, due_date, priority, status, subject) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, title, description, due_date, priority, status, subject",
      [
        userId,
        title.trim(),
        validDes,
        due_date,
        normalizedPriority,
        normalizedStatus,
        validSubject,
      ],
    );

    return res
      .status(201)
      .json({ message: "Successfully created new task", task: data.rows[0] });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to create a task" });
  }
}

// ####################### UPDATE TASK ####################################
async function updateTask(req: AuthedRequest, res: Response) {
  const userId = req.userId;
  const taskId = req.params.id;
  const body = req.body;
  if (!body) {
    return res.status(400).json({ error: "Invalied field provided" });
  }
  const { title, description, due_date, priority, status, subject } = body;

  // title validation
  if (title !== undefined) {
    if (typeof title !== "string") {
      return res.status(400).json({ error: "Invalid request" });
    }

    if (!title.trim()) {
      return res
        .status(400)
        .json({ error: "title needs not include empty spaces" });
    }
  }

  // due_date validation
  if (due_date !== undefined) {
    if (due_date !== null && typeof due_date !== "string") {
      return res.status(400).json({ error: "due_date must be string or null" });
    }
    const isValideDate = validateDate(due_date);
    if (typeof due_date === "string" && !isValideDate) {
      return res
        .status(400)
        .json({ error: "Due Date needs to be YYYY-MM-DD format" });
    }
  }

  // priority validation
  if (priority !== undefined) {
    if (typeof priority !== "string") {
      return res.status(400).json({ error: "Invalid Request" });
    }

    const normalizedPriority = priority.trim().toLowerCase();

    if (!isPriority(normalizedPriority)) {
      return res
        .status(400)
        .json({ error: "Priority must be low, medium or high" });
    }
  }

  // status validation
  if (status !== undefined) {
    if (typeof status !== "string") {
      return res.status(400).json({ error: "Invalid Request" });
    }

    const normalizedStatus = status.trim().toLowerCase();

    if (!isStatus(normalizedStatus)) {
      return res
        .status(400)
        .json({ error: "Status must be todo, in-progress or done" });
    }
  }

  // description validation
  if (description !== undefined) {
    if (description !== null && typeof description !== "string") {
      return res
        .status(400)
        .json({ error: "description must be string or null" });
    }
  }

  if (subject !== undefined) {
    if (subject !== null && typeof subject !== "string") {
      return res
        .status(400)
        .json({ error: "description must be string or null" });
    }
  }

  // Getting a task
  try {
    const data = await db.query(
      "SELECT * FROM tasks WHERE user_id = ($1) AND id = ($2)",
      [userId, taskId],
    );
    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = data.rows[0];

    const newTitle = title !== undefined ? title.trim() : task.title;
    const newDes =
      description !== undefined
        ? description === null
          ? null
          : description.trim() || null
        : task.description;
    const newSubject =
      subject !== undefined
        ? subject === null
          ? null
          : subject.trim() || null
        : task.subject;

    const newPriority =
      priority !== undefined
        ? priority.trim().toLocaleLowerCase()
        : task.priority;
    const newStatus =
      status !== undefined ? status.trim().toLowerCase() : task.status;
    const newDueDate = due_date !== undefined ? due_date : task.due_date;

    const newData = {
      title: newTitle,
      description: newDes,
      due_date: newDueDate,
      priority: newPriority,
      status: newStatus,
      subject: newSubject,
    };

    const updatedData = await db.query(
      "UPDATE tasks SET title=($1), description=($2), due_date = ($3), priority = ($4), status = ($5), subject = ($6), updated_at = now() WHERE user_id = ($7) AND id = ($8) RETURNING user_id, title, description, due_date, priority, status, subject ",
      [
        newData.title,
        newData.description,
        newData.due_date,
        newData.priority,
        newData.status,
        newData.subject,
        userId,
        taskId,
      ],
    );

    return res
      .status(200)
      .json({
        message: "Successfully updated new task",
        task: updatedData.rows[0],
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to update new task" });
  }
}

// ########################### DELETE TASK ####################################
async function deleteTask(req: AuthedRequest, res: Response) {
  const userId = req.userId;
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const data = await db.query(
      "DELETE FROM tasks WHERE user_id = ($1) AND id = ($2) RETURNING id",
      [userId, taskId],
    );

    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({ message: "Successfully deleted an item" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to delete an item" });
  }
}

export { getAllTasks, getTasksById, createNewTask, updateTask, deleteTask };
