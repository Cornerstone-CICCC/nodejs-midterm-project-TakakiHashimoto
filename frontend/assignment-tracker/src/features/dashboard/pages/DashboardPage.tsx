import { ArrowDownAZ, ListFilterPlus, Plus } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMemo, useState } from "react";
import { useTasks } from "../../tasks/hooks/useTasks";
import TaskCard from "../../tasks/components/TaskCard";
import AddEditModal from "../../tasks/components/AddEditModal";
import DeleteConfirmModal from "../../tasks/components/DeleteConfirmModal";
import type {
  FilterPriorityType,
  FilterStatusType,
  TaskType,
} from "../../tasks/types";

function DashboardPage() {
  const { user } = useAuth();
  const { editTasks, addTasks, deleteTasks, tasks } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState<boolean>(false);

  const [selectedStatus, setSelectedStatus] = useState<FilterStatusType>("all");
  const [selectedPriority, setSelectedPriority] =
    useState<FilterPriorityType>("all");

  let displayTasks: TaskType[] | [] = useMemo(() => {
    if (selectedStatus === "all" && selectedPriority === "all")
      return [...tasks];
    if (selectedStatus === "all" && !(selectedPriority === "all"))
      return tasks.filter((t) => t.priority === selectedPriority);
    if (!(selectedStatus === "all") && selectedPriority === "all")
      return tasks.filter((t) => t.status === selectedStatus);

    return tasks.filter(
      (t) => t.status === selectedStatus && t.priority === selectedPriority,
    );
  }, [selectedPriority, selectedStatus, tasks]);

  function resetFilter() {
    setSelectedPriority("all");
    setSelectedStatus("all");
  }
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

  const priorityMapping = { high: 3, medium: 2, low: 1 };

  function sortByPriorityAsc() {
    const tempTasks = [...tasks];
  }
  function sortByPriorityDesc() {}

  function sortByDueAsc() {}
  function sortByDueDesc() {}

  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.id === selectedTaskId);
  }, [selectedTaskId, tasks]);

  return (
    <div className="relative px-2">
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
        <div className="flex justify-start px-2.5">
          <div className="relative">
            <div className="flex gap-1 items-center mx-1.5 mt-0.5 relative  ">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex gap-1 items-center btn rounded-xs"
              >
                <ListFilterPlus />
                Filter by
              </button>
              {isFilterModalOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/10"
                    onClick={() => setIsFilterModalOpen(false)}
                  />
                  <div
                    className="absolute flex flex-col gap-2 top-full left-2  bg-white w-120 p-3 rounded-sm shadow-cyan-500/50 z-50 "
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-3 items-center ">
                      <h6 className="font-bold text-2xl text-black/60">
                        Status:
                      </h6>
                      <div className="w-full flex gap-2">
                        <span
                          className={`btn ${selectedStatus !== "all" && "btn-soft"} btn-secondary`}
                          onClick={() => setSelectedStatus("all")}
                        >
                          All
                        </span>
                        <span
                          className={`btn ${selectedStatus !== "todo" && "btn-soft"} btn-secondary`}
                          onClick={() => setSelectedStatus("todo")}
                        >
                          todo
                        </span>
                        <span
                          className={`btn ${selectedStatus !== "in-progress" && "btn-soft"} btn-secondary`}
                          onClick={() => setSelectedStatus("in-progress")}
                        >
                          in-progress
                        </span>
                        <span
                          className={`btn ${selectedStatus !== "done" && "btn-soft"} btn-secondary`}
                          onClick={() => setSelectedStatus("done")}
                        >
                          done
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <h6 className="font-bold text-2xl text-black/60">
                        Priority:
                      </h6>
                      <div className="w-full flex gap-2">
                        <span
                          className={`btn ${selectedPriority !== "all" && "btn-soft"} btn-secondary`}
                          onClick={() => setSelectedPriority("all")}
                        >
                          All
                        </span>
                        <span
                          className={`btn ${selectedPriority !== "low" && "btn-soft"} btn-secondary`}
                          onClick={() => setSelectedPriority("low")}
                        >
                          low
                        </span>
                        <span
                          className={`btn ${selectedPriority !== "medium" && "btn-soft"} btn-secondary`}
                          onClick={() => setSelectedPriority("medium")}
                        >
                          medium
                        </span>
                        <span
                          className={`btn ${selectedPriority !== "high" && "btn-soft"} btn-secondary`}
                          onClick={() => setSelectedPriority("high")}
                        >
                          high
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline btn-error w-full"
                      onClick={resetFilter}
                    >
                      Reset Filter
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="flex gap-1 items-center mx-1.5 mt-0.5 relative ">
              <button
                className="flex gap-1 items-center btn rounded-xs"
                onClick={() => setIsSortModalOpen(true)}
              >
                <ArrowDownAZ />
                Sort By
              </button>
              {isSortModalOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/10"
                    onClick={() => setIsSortModalOpen(false)}
                  />
                  <div
                    className="absolute flex flex-col gap-2 top-full left-2  bg-white w-120 p-3 rounded-sm shadow-cyan-500/50 z-50 "
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-3 items-center ">
                      <h6 className="font-bold text-2xl text-black/60">
                        Priority:
                      </h6>
                      <div className="w-full flex gap-2">
                        <span className={`btn btn-soft btn-secondary`}>
                          Ascending
                        </span>
                        <span className={`btn btn-soft btn-secondary`}>
                          Dscending
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <h6 className="font-bold text-2xl text-black/60">
                        Due_Date:
                      </h6>
                      <div className="w-full flex gap-2">
                        <span className={`btn btn-soft btn-secondary`}>
                          Ascending
                        </span>
                        <span className={`btn btn-soft btn-secondary`}>
                          Dscending
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-error w-full">
                      Reset Filter
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <h1 className="text-5xl">Welcome back, {user?.username}</h1>
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
          {displayTasks.length === 0 && <p>No assignments to display</p>}
          {displayTasks.map((t) => (
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
