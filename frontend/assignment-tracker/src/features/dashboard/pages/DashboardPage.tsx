import { Plus } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMemo, useState } from "react";
import { useTasks } from "../../tasks/hooks/useTasks";
import TaskCard from "../../tasks/components/TaskCard";
import AddEditModal from "../../tasks/components/AddEditModal";

function DashboardPage() {
  const { user } = useAuth();
  const { editTasks, addTasks, tasks } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  function closeModal() {
    setIsModalOpen(false);
    setMode("add");
  }

  function changeModeToEdit(id: string) {
    setIsModalOpen(true);
    setMode("edit");
    setSelectedTaskId(id);
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
        <div>
          {tasks.length === 0 && <p>No assignments to display</p>}
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} changeModeToEdit={changeModeToEdit} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
