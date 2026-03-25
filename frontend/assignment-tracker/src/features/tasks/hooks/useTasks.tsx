import { useCallback, useEffect, useState } from "react";
import type { CreateTaskType, TaskType, UpdateTaskType } from "../types";
import {
  createTask,
  deleteTask,
  getALlTasks,
  updateTask,
} from "../api/tasks.api";

// stateの一括管理みたいな
// Dashboardとかでやる、tasksをonload で読み込んだり、アップデートでtasksのstateを変えたりする系の一括管理
// ここで変わったstateは、コールしたコンポーネントのstateもかえる
function useTasks() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isTaksLoading, setIsTaskLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsTaskLoading(true);
      setError(null);
      const data = await getALlTasks();
      setTasks(data.tasks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch tasks");
      setTasks([]);
    } finally {
      setIsTaskLoading(false);
    }
  }, []);

  const addTasks = useCallback(async (input: CreateTaskType) => {
    try {
      setError(null);
      const data = await createTask(input); // { message: "Successfully created new task", task: data.rows[0] }
      setTasks((prev) => [data.task, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add task");
      throw e;
    }
  }, []);

  const editTasks = useCallback(async (input: UpdateTaskType, id: string) => {
    try {
      setError(null);
      const data = await updateTask(id, input);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? data.task : task)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update task");
      throw e;
    }
  }, []);

  const deleteTasks = useCallback(async (id: string) => {
    try {
      setError(null);
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
      throw e;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    isTaksLoading,
    error,
    fetchTasks,
    editTasks,
    deleteTasks,
    addTasks,
  };
}

export { useTasks };
