import { Link, useNavigate } from "react-router";
import { School } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="navbar bg-base-300">
      <div className="max-w-5xl mx-auto w-full px-4 flex justify-between items-center">
        <div>
          <Link to="/" className="btn btn-ghost gap-2">
            <School className="size-7 text-primary" />
            <span className="text-lg font-bold">TK Classroom</span>
          </Link>
        </div>
        <div>
          {user ? (
            <button
              onClick={() => {
                try {
                  logout();
                  navigate("/login");
                } catch (err) {
                  console.error(err);
                }
              }}
              className="cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
