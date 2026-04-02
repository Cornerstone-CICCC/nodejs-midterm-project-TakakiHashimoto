import { useContext } from "react";
import { TaskContext } from "../../../app/providers/TaskProvider";

function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("TaskContext must be used within provider");
  return context;
}

export { useTasks };
