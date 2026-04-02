import type { CreateTaskType, UpdateTaskType } from "../types";

const baseUrl = "http://localhost:5000/api/tasks";

async function getErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json();
    return data.error ? data.error : fallback;
  } catch (e) {
    return fallback;
  }
}

// res.ok => return status which is sent from backend, 2XX = .ok
async function getAllTasks() {
  const res = await fetch(`${baseUrl}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, "Failed to fetch tasks");
    throw new Error(message);
  }

  return await res.json();
}

async function getTaskById(id: string) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const message = await getErrorMessage(
      res,
      "Failed to fetch a task with this id",
    );
    throw new Error(message);
  }

  return await res.json();
}

async function createTask(data: CreateTaskType) {
  const res = await fetch(`${baseUrl}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, "Failed to create task");
    throw new Error(message);
  }

  return await res.json();
}

async function updateTask(id: string, data: UpdateTaskType) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const message = await getErrorMessage(res, "Failed to update a task ");
    throw new Error(message);
  }

  return await res.json();
}

async function deleteTask(id: string) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const message = await getErrorMessage(res, "Failed to delete a task");
    throw new Error(message);
  }

  return await res.json();
}

export { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
