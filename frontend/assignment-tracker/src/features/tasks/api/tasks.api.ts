import type { CreateTaskType, UpdateTaskType } from "../types";

const baseUrl = "http://localhost:5000/api/tasks";

// res.ok => return status which is sent from backend, 2XX = .ok
async function getALlTasks() {
  const res = await fetch(`${baseUrl}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch tasks");

  return await res.json();
}

async function getTaskById(id: string) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch a task with this id");

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
    console.log("Failed to updating");
    throw new Error("Failed to fetch tasks");
  }

  console.log("Succeded in updating");
  return await res.json();
}

async function updateTask(id: string, data: UpdateTaskType) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update a task");

  return await res.json();
}

async function deleteTask(id: string) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete a task");

  return await res.json();
}

export { getALlTasks, getTaskById, createTask, updateTask, deleteTask };
