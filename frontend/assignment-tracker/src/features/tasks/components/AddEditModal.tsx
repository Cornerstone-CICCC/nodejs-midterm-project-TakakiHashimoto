import { useEffect, useState } from "react";
import type {
  CreateTaskType,
  PriorityType,
  StatusType,
  TaskType,
  UpdateTaskType,
} from "../types";
import { ChevronDown } from "lucide-react";

function AddEditModal({
  editingTask,
  closeModal,
  mode,
  editTasks,
  addTasks,
}: {
  editingTask?: TaskType | null;
  closeModal: () => void;
  mode: "add" | "edit";
  editTasks: (id: string, data: UpdateTaskType) => Promise<void>;
  addTasks: (input: CreateTaskType) => Promise<void>;
}) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<PriorityType>("medium");
  const [status, setStatus] = useState<StatusType>("todo");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleCancel() {
    setTitle("");
    setDescription("");
    setSubject("");
    setDueDate("");
    setPriority("medium");
    setStatus("todo");
    closeModal();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    try {
      setIsSubmitting(true);
      const data = {
        title,
        description,
        subject,
        due_date: dueDate,
        priority,
        status,
      };
      if (mode === "edit" && editingTask?.id) {
        await editTasks(editingTask.id, data);
        console.log("Succeessfully updated");
      } else {
        await addTasks(data);
      }
      closeModal();
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Failed to add/edit task",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!editingTask) return;
    const formatDueDate = editingTask.due_date?.split("T")[0];
    setTitle(editingTask.title);
    setDescription(editingTask.description ?? "");
    setSubject(editingTask.subject ?? "");
    setDueDate(formatDueDate ?? "");
    setPriority(editingTask.priority);
    setStatus(editingTask.status);
  }, [editingTask]);

  return (
    <div
      className="fixed z-10 flex justify-center items-center w-full h-screen bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) closeModal();
      }}
    >
      <div className="bg-white card" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between">
          <h2 className="text-white text-4xl">
            {mode === "edit" ? "Update Assignment" : "Add Assignment"}
          </h2>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => closeModal()}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="assignment-title">Assignment Title</label>
            <input
              type="text"
              name="assignment-title"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              className="input input-success rounded-sm w-full text-secondary"
              value={title}
              id="assignment-title"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex gap-1">
              <label htmlFor="subject">Subject</label>
              <input
                name="subject"
                id="subject"
                value={subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSubject(e.target.value)
                }
                type="text"
                disabled={isSubmitting}
                className="input input-success rounded-sm text-secondary"
              />
            </div>
            <div className="flex gap-1">
              <label htmlFor="subject">Due Date</label>
              <input
                name="due-date"
                id="due-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                type="date"
                disabled={isSubmitting}
                className="input input-success rounded-sm text-secondary"
              />
            </div>
          </div>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={isSubmitting}
            className=" text-secondary rounded-sm p-2 base-200 bg-black/30"
          />
          <div className="flex gap-3">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1 flex gap-1">
                <span>{priority}</span> <ChevronDown />
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li
                  onClick={() => {
                    if (!isSubmitting) {
                      setPriority("low");
                    }
                  }}
                  className="cursor-pointer text-white hover:text-black hover:bg-white hover:font-bold hover:rounded-sm px-2"
                >
                  low
                </li>
                <li
                  onClick={() => {
                    if (!isSubmitting) {
                      setPriority("medium");
                    }
                  }}
                  className="cursor-pointer text-white hover:text-black hover:bg-white hover:font-bold hover:rounded-sm px-2"
                >
                  medium
                </li>
                <li
                  onClick={() => {
                    if (!isSubmitting) {
                      setPriority("high");
                    }
                  }}
                  className="cursor-pointer text-white hover:text-black hover:bg-white hover:font-bold hover:rounded-sm px-2"
                >
                  high
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1 flex gap-1">
                <span>{status}</span>
                <ChevronDown />
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li
                  onClick={() => {
                    if (!isSubmitting) {
                      setStatus("todo");
                    }
                  }}
                  className="cursor-pointer text-white hover:text-black hover:bg-white hover:font-bold hover:rounded-sm px-2"
                >
                  todo
                </li>
                <li
                  onClick={() => {
                    if (!isSubmitting) {
                      setStatus("in-progress");
                    }
                  }}
                  className="cursor-pointer text-white hover:text-black hover:bg-white hover:font-bold hover:rounded-sm px-2"
                >
                  in-progress
                </li>
                <li
                  onClick={() => {
                    if (!isSubmitting) {
                      setStatus("done");
                    }
                  }}
                  className="cursor-pointer text-white hover:text-black hover:bg-white hover:font-bold hover:rounded-sm px-2"
                >
                  done
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between px-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="btn btn-info cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Adding..."
                : mode === "edit"
                  ? "Update assignment"
                  : "Add assignment"}
            </button>
          </div>
          {submitError && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{submitError}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddEditModal;
