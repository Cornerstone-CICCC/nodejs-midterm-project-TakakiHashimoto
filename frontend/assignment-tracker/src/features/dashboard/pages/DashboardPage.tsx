import { Plus } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useState } from "react";

function DashboardPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      <h1>Welcome back, {user?.username}</h1>
      <div>
        <p className="flex gap-1 items-center">
          <span>
            <Plus />
          </span>
          Add task
        </p>
      </div>
      <div></div>
    </div>
  );
}

export default DashboardPage;
