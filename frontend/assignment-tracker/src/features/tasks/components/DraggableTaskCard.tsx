import type { TaskType } from "../types";
import { Link } from "react-router";

function DraggableTaskCard({
  task,
  changeModeToEdit,
  openDeleteModal,
}: {
  task: TaskType;
  changeModeToEdit: (id: string) => void;
  openDeleteModal: (id: string) => void;
}) {
  // This is the each task card
  // This card needs to be draggable.
  // This needs to listen dragstart, being dragged
  // when dragged => Set the task id so that we know which task is being dragged

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

  const computeDueDate = () => {
    if (!task?.due_date) return "Due Date: No Due Date is provided";
    const dueDate = new Date(task.due_date);
    if (Number.isNaN(dueDate.getTime()))
      return "Due Date: Invalid Due Date format";

    const year = dueDate.getFullYear();
    const month = dueDate.toLocaleDateString("en-US", { month: "short" });
    const date = dueDate.getDate();
    const day = dueDate.toLocaleDateString("en-US", { weekday: "long" });
    return `Due Date: ${year}-${month}-${date}, ${day}`;
  };

  const computedDueDate = computeDueDate();

  return (
    <div
      draggable={true}
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("currentStatus", task.status);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="card"
    >
      <Link to={`/tasks/${task.id}`}>
        <div className="flex gap-3">
          <span className={`task-badge ${statusBadgeStyle}`}>
            {task.status}
          </span>
          <span className={`task-badge ${badgeStyle}`}>{task.priority}</span>
        </div>

        <h2 className="card-task-title">{task.title}</h2>
        <div>
          <p>{computedDueDate}</p>
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

export default DraggableTaskCard;
