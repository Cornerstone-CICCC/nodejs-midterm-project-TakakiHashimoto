import { useEffect, useState } from "react";
import type { PriorityType, StatusType, TaskType } from "../types";
import { useTasks } from "../hooks/useTasks";

function AddEditModal({
  editingTasks,
  closeModal,
  mode,
}: {
  editingTasks?: TaskType;
  closeModal: () => void;
  mode: "add" | "edit";
}) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<PriorityType>("medium");
  const [status, setStatus] = useState<StatusType>("todo");

  const { editTasks, addTasks } = useTasks();

  function handleCancel() {
    setTitle("");
    setDescription("");
    setSubject("");
    setDueDate("");
    setPriority("medium");
    setStatus("todo");
    closeModal();
  }

  function handleSubmit(id: string) {
    const data = {
      title,
      description,
      subject,
      due_date: dueDate,
      priority,
      status,
    };
    mode === "edit" ? editTasks(id, data) : addTasks(data);
    console.log("Successfully executed");
  }

  useEffect(() => {
    if (!editingTasks) return;
    setTitle(editingTasks.title);
    setDescription(editingTasks.description ?? "");
    setSubject(editingTasks.subject ?? "");
    setDueDate(editingTasks.due_date ?? "");
    setPriority(editingTasks.priority);
    setStatus(editingTasks.status);
  }, []);
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
        <form className="flex flex-col gap-3">
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
                className="input input-success rounded-sm"
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
                className="input input-success rounded-sm"
              />
            </div>
          </div>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <div className="flex gap-3">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1">
                Priority
              </div>
              <ul
                tabIndex="-1"
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li
                  onClick={() => setPriority("low")}
                  className="cursor-pointer"
                >
                  low
                </li>
                <li
                  onClick={() => setPriority("medium")}
                  className="cursor-pointer"
                >
                  medium
                </li>
                <li
                  onClick={() => setPriority("high")}
                  className="cursor-pointer"
                >
                  high
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1">
                Status
              </div>
              <ul
                tabIndex="-1"
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li
                  onClick={() => setStatus("todo")}
                  className="cursor-pointer text-white"
                >
                  todo
                </li>
                <li
                  onClick={() => setStatus("in-progress")}
                  className="cursor-pointer text-white"
                >
                  in-progress
                </li>
                <li
                  onClick={() => setStatus("done")}
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
            <button onClick={() => handleSubmit(editingTasks?.id)}>
              Add assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditModal;
