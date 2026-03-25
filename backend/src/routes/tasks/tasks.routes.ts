// | Method | Route            | Description                        |
// | ------ | ---------------- | ---------------------------------- |
// | GET    | `/api/tasks`     | Get all tasks for current user     |
// | GET    | `/api/tasks/:id` | Get one task owned by current user |
// | POST   | `/api/tasks`     | Create new task                    |
// | PATCH  | `/api/tasks/:id` | Update task                        |
// | DELETE | `/api/tasks/:id` | Delete task                        |

import { Router } from "express";
import {
  getAllTasks,
  getTasksById,
  createNewTask,
  updateTask,
  deleteTask,
} from "./tasks.controller";
import { authRequired } from "../../middleware/auth.middleware";

const taskRouter = Router();

taskRouter.get("/", authRequired, getAllTasks);
taskRouter.get("/:id", authRequired, getTasksById);
taskRouter.post("/", authRequired, createNewTask);
taskRouter.put("/:id", authRequired, updateTask);
taskRouter.delete("/:id", authRequired, deleteTask);

export default taskRouter;
