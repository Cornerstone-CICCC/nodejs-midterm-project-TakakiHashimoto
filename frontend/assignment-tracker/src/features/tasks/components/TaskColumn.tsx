import type { TaskType } from "../types";
import TaskCard from "./TaskCard";

function TaskColumn({
  columnId,
  title,
  tasks,
}: {
  columnId: string;
  title: string;
  tasks: TaskType[];
}) {
  return (
    <div>
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl">{title}</h2>
        <div>
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

export default TaskColumn;
