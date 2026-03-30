import type { TaskType } from "../types";

function TaskCard({
  task,
  changeModeToEdit,
}: {
  task: TaskType;
  changeModeToEdit: () => void;
}) {
  const badgeStyle =
    task.priority === "high"
      ? "badge-high"
      : task.priority === "medium"
        ? "badge-medium"
        : "badge-low";
  if (!task.due_date) {
    return (
      <div className="card">
        <div>
          <span>{task.status}</span>
          <span>{task.priority}</span>
        </div>

        <h2>{task.title}</h2>
        <div>
          <p>No due_date provided</p>
        </div>
      </div>
    );
  }

  const dueDate = new Date(task.due_date);
  if (Number.isNaN(dueDate)) {
    return (
      <div className="card">
        <div>
          <span>{task.status}</span>
          <span>{task.priority}</span>
        </div>

        <h2>{task.title}</h2>
        <div>
          <p>Due: Invalid due date</p>
        </div>
      </div>
    );
  }
  const year = dueDate.getFullYear();
  const month = dueDate.toLocaleDateString("en-US", { month: "short" });
  const date = dueDate.getDate();
  const day = dueDate.toLocaleDateString("en-US", { weekday: "long" });
  return (
    <div className="card">
      <div>
        <span>{task.status}</span>
        <span className={badgeStyle}>{task.priority}</span>
      </div>

      <h2 className="card-title">{task.title}</h2>
      <div>
        <p>
          Due: {day}, {month} {date}, {year}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          className="btn btn-outline btn-warning rounded-md"
          onClick={() => changeModeToEdit()}
        >
          edit
        </button>
        <button className="btn btn-outline btn-error rounded-md">delete</button>
      </div>
    </div>
  );
}

export default TaskCard;
