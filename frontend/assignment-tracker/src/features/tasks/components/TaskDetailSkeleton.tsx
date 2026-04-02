function TaskDetailSkeleton() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen ">
      <div className="text-4xl">Task Detail</div>
      <div className="card w-1/2 h-60 animate-pulse ">
        <div className="flex gap-2">
          <div className="flex flex-col gap-4">
            <div className="w-70 h-7 bg-gray-600 rounded-sm"></div>
            <div className="w-70 h-7 bg-gray-600 rounded-sm"></div>
            <div className="w-70 h-7 bg-gray-600 rounded-sm"></div>
            <div className="w-70 h-7 bg-gray-600 rounded-sm"></div>
          </div>
          <div>
            <div className="w-70 h-36 bg-gray-600 rounded-sm card mt-5 ml-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailSkeleton;
