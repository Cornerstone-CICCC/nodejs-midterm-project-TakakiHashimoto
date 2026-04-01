type PriorityType = "low" | "medium" | "high";
type StatusType = "todo" | "in-progress" | "done";

type FilterStatusType = "all" | "todo" | "in-progress" | "done";
type FilterPriorityType = "all" | "low" | "medium" | "high";
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

type UseTasksReturnType = {
  tasks: TaskType[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTasks: (input: CreateTaskType) => Promise<void>;
  editTasks: (id: string, data: UpdateTaskType) => Promise<void>;
  deleteTasks: (id: string) => Promise<void>;
};
export type {
  PriorityType,
  StatusType,
  TaskType,
  CreateTaskType,
  UpdateTaskType,
  UseTasksReturnType,
  FilterStatusType,
  FilterPriorityType,
};
