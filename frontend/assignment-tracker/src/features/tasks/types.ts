type PriorityType = "low" | "medium" | "high";
type StatusType = "todo" | "in-progress" | "done";

type FilterStatusType = "all" | "todo" | "in-progress" | "done";
type FilterPriorityType = "all" | "low" | "medium" | "high";
type SortType =
  | "none"
  | "priority-asc"
  | "priority-desc"
  | "due-asc"
  | "due-desc";

type TaskType = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: PriorityType;
  status: StatusType;
  subject: string | null;
};

type CreateTaskType = {
  title: string;
  description?: string;
  due_date?: string;
  priority?: PriorityType;
  status?: StatusType;
  subject?: string;
};

type UpdateTaskType = {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: PriorityType;
  status?: StatusType;
  subject?: string;
};

type TaskContextType = {
  tasks: TaskType[];
  isTasksLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  editTask: (id: string, input: UpdateTaskType) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  addTask: (input: CreateTaskType) => Promise<void>;
};

export type {
  PriorityType,
  StatusType,
  TaskType,
  CreateTaskType,
  UpdateTaskType,
  FilterStatusType,
  FilterPriorityType,
  SortType,
  TaskContextType,
};
