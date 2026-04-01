import { Link } from "react-router";
import type { TaskType } from "../types";

function TaskCard({
  task,
  changeModeToEdit,
  openDeleteModal,
}: {
  task: TaskType;
  changeModeToEdit: (id: string) => void;
  openDeleteModal: (id: string) => void;
}) {
  const badgeStyle =
    task.priority === "high"
      ? "badge-high"
      : task.priority === "medium"
        ? "badge-medium"
        : "badge-low";

  const statusBadgeStyle =
    task.status === "todo"
      ? "badge-high"
      : task.status === "in-progress"
        ? "badge-medium"
        : "badge-low";

  if (!task.due_date) {
    return (
      <Link to={`/tasks/${task.id}`}>
        <div className="card">
          <div>
            <span>{task.status}</span>
            <span>{task.priority}</span>
          </div>

          <h2 className="text-4xl">{task.title}</h2>
          <div>
            <p>No due_date provided</p>
          </div>
        </div>
      </Link>
    );
  }

  const dueDate = new Date(task.due_date);
  if (Number.isNaN(dueDate.getTime())) {
    return (
      <Link to={`/tasks/${task.id}`}>
        <div className="card">
          <div className="flex gap-6">
            <span>{task.status}</span>
            <span>{task.priority}</span>
          </div>

          <h2 className="text-4xl">{task.title}</h2>
          <div>
            <p>Due: Invalid due date</p>
          </div>
        </div>
      </Link>
    );
  }
  const year = dueDate.getFullYear();
  const month = dueDate.toLocaleDateString("en-US", { month: "short" });
  const date = dueDate.getDate();
  const day = dueDate.toLocaleDateString("en-US", { weekday: "long" });
  return (
    <div className="card">
      <Link to={`/tasks/${task.id}`}>
        <div className="flex gap-3">
          <span className={`task-badge ${statusBadgeStyle}`}>
            {task.status}
          </span>
          <span className={`task-badge ${badgeStyle}`}>{task.priority}</span>
        </div>

        <h2 className="card-task-title">{task.title}</h2>
        <div>
          <p>
            Due: {day}, {month} {date}, {year}
          </p>
        </div>
      </Link>
      <div className="flex gap-3">
        <button
          className="btn btn-outline btn-warning rounded-md"
          onClick={(e) => {
            e.stopPropagation();
            changeModeToEdit(task.id);
          }}
        >
          edit
        </button>
        <button
          className="btn btn-outline btn-error rounded-md"
          onClick={() => openDeleteModal(task.id)}
        >
          delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
