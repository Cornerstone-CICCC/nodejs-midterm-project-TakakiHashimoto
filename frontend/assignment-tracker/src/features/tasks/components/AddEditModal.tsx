import { useEffect, useState } from "react";
import type {
  CreateTaskType,
  PriorityType,
  StatusType,
  TaskType,
  UpdateTaskType,
} from "../types";

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
  const [priorityDisplayName, setPriorityDisplayName] =
    useState<string>("Priority");
  const [statusDisplayName, setStatusDisplayName] =
    useState<string>("Priority");

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

    console.log("Successfully executed");
    closeModal();
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
    <div className="fixed bg-black/70 z-10 flex justify-center items-center w-full h-screen">
      <div className="bg-white card">
        <div className="flex justify-between">
          <h2 className="text-blue-800 text-2xl">Add assignments</h2>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => closeModal()}
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
            className="bg-black text-secondary rounded-sm p-2"
          />
          <div className="flex gap-3">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1">
                {priorityDisplayName}
              </div>
              <ul
                tabIndex="-1"
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li
                  onClick={() => {
                    setPriority("low");
                    setPriorityDisplayName("low");
                  }}
                  className="cursor-pointer text-white"
                >
                  low
                </li>
                <li
                  onClick={() => {
                    setPriority("medium");
                    setPriorityDisplayName("medium");
                  }}
                  className="cursor-pointer text-white"
                >
                  medium
                </li>
                <li
                  onClick={() => {
                    setPriority("high");
                    setPriorityDisplayName("high");
                  }}
                  className="cursor-pointer text-white"
                >
                  high
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1">
                {statusDisplayName}
              </div>
              <ul
                tabIndex="-1"
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li
                  onClick={() => {
                    setStatus("todo");
                    setStatusDisplayName("todo");
                  }}
                  className="cursor-pointer text-white"
                >
                  todo
                </li>
                <li
                  onClick={() => {
                    setStatus("in-progress");
                    setStatusDisplayName("in-progress");
                  }}
                  className="cursor-pointer text-white"
                >
                  in-progress
                </li>
                <li
                  onClick={() => {
                    setStatus("done");
                    setStatusDisplayName("done");
                  }}
                  className="cursor-pointer text-white"
                >
                  done
                </li>
              </ul>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button className="btn-primary cursor-pointer">
              Add assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditModal;
