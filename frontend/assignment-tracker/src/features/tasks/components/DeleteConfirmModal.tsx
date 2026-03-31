import { Trash2 } from "lucide-react";
import type { TaskType } from "../types";

function DeleteConfirmModal({
  closeModal,
  task,
  deleteTasks,
}: {
  closeModal: () => void;
  task: TaskType;
  deleteTasks: (id: string) => void;
}) {
  async function handleDelete() {
    await deleteTasks(task.id);
    closeModal();
  }

  return (
    <div
      className="fixed z-10 flex justify-center items-center w-full h-screen bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between">
          <h2>Are you sure you want to delete this task?</h2>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => closeModal()}
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex gap-1">
            <p className="text-2xl">Title:</p>
            <p>{task.title}</p>
          </div>
          <div className="flex gap-1">
            <p className="text-2xl">Description:</p>
            <p>{task.description}</p>
          </div>
          <div className="flex gap-1">
            <p className="text-2xl">Due Date:</p>
            <p>{task.due_date}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => closeModal()}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex gap-1 btn btn-outline btn-error rounded-full"
          >
            <Trash2 />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
