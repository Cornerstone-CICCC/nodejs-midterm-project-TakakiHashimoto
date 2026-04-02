import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useMemo,
  type ReactNode,
} from "react";
import type {
  CreateTaskType,
  TaskContextType,
  TaskType,
  UpdateTaskType,
} from "../../features/tasks/types";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../../features/tasks/api/tasks.api";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsTasksLoading(true);
      setError(null);
      const data = await getAllTasks();
      setTasks(data.tasks);
    } catch (e) {
      // the error catched here is the error thrown in the "tasks.api.ts" when !res.ok
      setError(e instanceof Error ? e.message : "Failed to fetch tasks");
      setTasks([]);
    } finally {
      setIsTasksLoading(false);
    }
  }, []);

  const addTask = useCallback(async (input: CreateTaskType) => {
    try {
      setError(null);
      const data = await createTask(input); // { message: "Successfully created new task", task: data.rows[0] }

      setTasks((prev) => [data.task, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add task");
      throw e;
    }
  }, []);

  const editTask = useCallback(async (id: string, input: UpdateTaskType) => {
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

  const removeTask = useCallback(async (id: string) => {
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
  }, [fetchTasks]);

  const value = useMemo<TaskContextType>(() => {
    return {
      tasks,
      isTasksLoading,
      error,
      fetchTasks,
      editTask,
      removeTask,
      addTask,
    };
  }, [tasks, isTasksLoading, error, fetchTasks, editTask, deleteTask, addTask]);
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export { TaskContext, TaskProvider };
