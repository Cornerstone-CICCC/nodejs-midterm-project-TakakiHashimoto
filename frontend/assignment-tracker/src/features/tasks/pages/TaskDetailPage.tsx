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
import TaskDetailSkeleton from "../components/TaskDetailSkeleton";

function TaskDetailPage() {
  const {
    tasks,
    editTask,
    removeTask,
    addTask,
    isTasksLoading,
    error,
    fetchTasks,
  } = useTasks();
  const { taskId } = useParams();
  const task = tasks.find((t) => t.id === taskId);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

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

  if (isTasksLoading) {
    return <TaskDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 items-start justify-center mt-3">
        <div
          role="alert"
          className="alert alert-error alert-soft w-full items-center"
        >
          <p>Failed to load task detail. Please try again.</p>
          <span>{error}</span>
        </div>
        <p className="text-3xl pl-3">{error}</p>
        <button
          className="btn w-1/5 text-2xl btn-error"
          onClick={() => {
            fetchTasks();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!task)
    return (
      <div>
        <div>
          <h3 className="text-2xl">Task not found</h3>
          <p>The task may have been deleted or the link may be invalid.</p>
        </div>

        <Link
          to={"/dashboard"}
          className="pl-3 hover:underline-offset-4 hover:underline flex gap-1 items-center hover:scale-105 duration-300"
        >
          Go to dashboard
          <MoveRight className="hover:translate-x-1 duration-300" />
        </Link>
      </div>
    );

  function closeModal() {
    setIsEditModalOpen(false);
  }

  return (
    <div className="relative flex flex-col justify-start items-center pt-6">
      {isEditModalOpen && (
        <AddEditModal
          mode="edit"
          editTasks={editTask}
          editingTask={task}
          closeModal={closeModal}
          addTasks={addTask}
          isModalOpen={isEditModalOpen}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          task={task}
          deleteTasks={removeTask}
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
            <CalendarDays /> {computedDueDate}
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
          <button
            className="flex gap-1 items-center justify-between btn btn-warning rounded-xs"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil />
            Edit your task
          </button>

          <button
            className="flex gap-1 items-center justify-between btn btn-error rounded-xs"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 />
            <span className="w-3/4">Delete</span>
          </button>

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
