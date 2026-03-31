import { Plus } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMemo, useState } from "react";
import { useTasks } from "../../tasks/hooks/useTasks";
import TaskCard from "../../tasks/components/TaskCard";
import AddEditModal from "../../tasks/components/AddEditModal";
import DeleteConfirmModal from "../../tasks/components/DeleteConfirmModal";

function DashboardPage() {
  const { user } = useAuth();
  const { editTasks, addTasks, deleteTasks, tasks } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  function closeModal() {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setMode("add");
    setSelectedTaskId("");
  }

  function changeModeToEdit(id: string) {
    setIsModalOpen(true);
    setMode("edit");
    setSelectedTaskId(id);
  }

  function openDeleteModal(id: string) {
    setSelectedTaskId(id);
    setIsDeleteModalOpen(true);
  }

  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.id === selectedTaskId);
  }, [selectedTaskId, tasks]);

  return (
    <div className="relative">
      {isModalOpen && (
        <AddEditModal
          closeModal={closeModal}
          mode={mode}
          editingTask={mode === "edit" ? selectedTask : null}
          editTasks={editTasks}
          addTasks={addTasks}
        />
      )}
      {/* will fix to type gurad when the task is undefined */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          task={selectedTask!}
          closeModal={closeModal}
          deleteTasks={deleteTasks}
        />
      )}
      <div className="flex flex-col gap-3">
        <h1>Welcome back, {user?.username}</h1>
        <div>
          <button
            className="flex gap-1 items-center btn btn-primary rounded-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <span>
              <Plus />
            </span>
            Add task
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {tasks.length === 0 && <p>No assignments to display</p>}
          {tasks.map((t) => (
            <TaskCard
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

export default DashboardPage;
