import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";

function PublicOnlyRoutes() {
  const { user, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  if (user) return <Navigate to="/dashboard" />;

  console.log("User is not There");
  return <Outlet />;
}

export default PublicOnlyRoutes;
