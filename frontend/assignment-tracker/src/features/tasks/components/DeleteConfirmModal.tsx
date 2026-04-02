import { Trash2 } from "lucide-react";
import type { TaskType } from "../types";
import { useState } from "react";

function DeleteConfirmModal({
  closeModal,
  task,
  deleteTasks,
}: {
  closeModal: () => void;
  task: TaskType;
  deleteTasks: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  async function handleDelete() {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteTasks(task.id);
      closeModal();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className="fixed z-10 flex justify-center items-center w-full h-screen bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) closeModal();
      }}
    >
      <div className="card z-20 " onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl">
            Are you sure you want to delete this task?
          </h2>
          <button
            className="btn btn-lg btn-circle btn-ghost"
            onClick={() => {
              if (!isDeleting) closeModal();
            }}
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex gap-1 items-center">
            <p className="text-2xl">Title:</p>
            <p>{task.title}</p>
          </div>
          <div className="flex gap-1 items-center">
            <p className="text-2xl">Description:</p>
            <p>{task.description}</p>
          </div>
          <div className="flex gap-1 items-center">
            <p className="text-2xl">Due Date:</p>
            <p>{task.due_date}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => closeModal()}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex gap-1 btn btn-outline btn-error rounded-full"
            disabled={isDeleting}
          >
            <Trash2 />
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </button>
          {deleteError && (
            <div role="alert" className="alert alert-error alert-soft">
              <span>{deleteError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
