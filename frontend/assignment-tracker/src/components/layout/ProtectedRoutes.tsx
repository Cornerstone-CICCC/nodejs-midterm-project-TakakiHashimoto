import { useAuth } from "../../features/auth/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

function ProtectedRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;
  console.log("User is there");

  return <Outlet />;
}

export default ProtectedRoutes;
