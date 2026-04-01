import {
  CalendarDays,
  Check,
  Flag,
  MoveRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router";
import AddEditModal from "../components/AddEditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

function TaskDetailPage() {
  const { tasks, editTasks, deleteTasks } = useTasks();
  const { taskId } = useParams();
  const task = tasks.find((t) => t.id === taskId);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  if (!task) return <h1>No Task Found</h1>;
  if (!task.due_date) {
    return (
      <div>
        <div>
          <h1 className="text-5xl">Task Detail</h1>
        </div>
        <div>
          <div>
            <h2 className="card-task-title">{task.title}</h2>
            <p>
              Subject: <span>{task.subject}</span>
            </p>
            <p>
              Description:<span>{task.description}</span>
            </p>
            <div className="flex gap-1 items-center">
              <CalendarDays /> No Due Date is provided
            </div>
            <div>
              <Flag />
              Priority: {task.priority}
            </div>
            <div>
              <Check />
              Status: {task.status}
            </div>
          </div>
          <div>
            <div className="flex gap-1">
              <Pencil />
              <button>Edit your task</button>
            </div>
            <div className="flex gap-1">
              <Trash2 />
              <button>Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const dueDate = new Date(task.due_date);
  if (Number.isNaN(dueDate.getTime())) {
    return (
      <div>
        <div>
          <h1 className="text-5xl">Task Detail</h1>
        </div>
        <div>
          <div>
            <h2 className="card-task-title">{task.title}</h2>
            <p>
              Subject: <span>{task.subject}</span>
            </p>
            <p>
              Description:<span>{task.description}</span>
            </p>
            <div className="flex gap-1 items-center">
              <CalendarDays /> Due Date: Invalid Due Date format
            </div>
            <div>
              <Flag />
              Priority: {task.priority}
            </div>
            <div>
              <Check />
              Status: {task.status}
            </div>
          </div>
          <div>
            <div className="flex gap-1">
              <Pencil />
              <button>Edit your task</button>
            </div>
            <div className="flex gap-1">
              <Trash2 />
              <button>Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function closeModal() {
    setIsEditModalOpen(false);
  }

  const year = dueDate.getFullYear();
  const month = dueDate.toLocaleDateString("en-US", { month: "short" });
  const date = dueDate.getDate();
  const day = dueDate.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="relative flex flex-col justify-start items-center pt-6">
      {isEditModalOpen && (
        <AddEditModal
          mode="edit"
          editTasks={editTasks}
          editingTask={task}
          closeModal={closeModal}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          task={task}
          deleteTasks={deleteTasks}
          closeModal={() => setIsDeleteModalOpen(false)}
        />
      )}
      <div>
        <h1 className="text-5xl">Task Detail</h1>
      </div>
      <div className="flex gap-6 justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="card-task-title">{task.title}</h2>
          <p>
            Subject: <span>{task.subject}</span>
          </p>
          <p className="flex flex-col">
            Description:<span>{task.description}</span>
          </p>
          <div className="flex gap-1 items-center">
            <CalendarDays /> Due Date: {year}-{month}-{date}, {day}
          </div>
          <div className="flex gap-1 items-center">
            <Flag />
            Priority: {task.priority}
          </div>
          <div className="flex gap-1 items-center">
            <Check />
            Status: {task.status}
          </div>
        </div>
        <div className="flex flex-col gap-5 border border-emerald-500 p-5 rounded-sm card">
          <div
            className="flex gap-1 items-center btn btn-warning rounded-xs"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil />
            <button>Edit your task</button>
          </div>
          <div
            className="flex gap-1 items-center btn btn-error rounded-xs"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 />
            <button>Delete</button>
          </div>
          <Link
            to={"/dashboard"}
            className="pl-3 hover:underline-offset-4 hover:underline flex gap-1 items-center hover:scale-105 duration-300"
          >
            Go to dashboard
            <MoveRight className="hover:translate-x-1 duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailPage;
