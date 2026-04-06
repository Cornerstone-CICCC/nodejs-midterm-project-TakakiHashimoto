import type { TaskType, UpdateTaskType } from "../types";
import DraggableTaskCard from "./DraggableTaskCard";

function TaskColumn({
  columnId,
  title,
  tasks,
  editTask,
  changeModeToEdit,
  openDeleteModal,
}: {
  columnId: "todo" | "in-progress" | "done";
  title: string;
  tasks: TaskType[];
  editTask: (id: string, data: UpdateTaskType) => Promise<void>;
  changeModeToEdit: (id: string) => void;
  openDeleteModal: (id: string) => void;
}) {
  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    // update the task status
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const currentStatus = e.dataTransfer.getData("currentStatus") as
      | "todo"
      | "in-progress"
      | "done";
    if (!taskId) return;
    if (currentStatus === columnId) return;
    await editTask(taskId, { status: columnId });
  }

  return (
    // This column needs to listen onDrop event.
    // When task is dropped, update the associated task to the colum id

    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="card "
    >
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl">{title}</h2>
        <div className="flex flex-col gap-3">
          {tasks.map((t) => (
            <DraggableTaskCard
              key={t.id}
              task={t}
              changeModeToEdit={changeModeToEdit}
              openDeleteModal={openDeleteModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskColumn;
