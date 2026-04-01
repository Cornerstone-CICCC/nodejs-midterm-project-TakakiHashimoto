import { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = { email, password };
    try {
      await login(data);
      navigate("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to log you in");
    }
  }

  useEffect(() => setError(null), []);
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen">
      <div className="bg-black/65 min-w-1/4 min-h-4/12 p-11 border shadow-2xl shadow-emerald-500 border-emerald-600 flex flex-col gap-4 rounded-sm justify-center items-center">
        <div>
          <h2 className="text-4xl">LOGIN</h2>
        </div>
        <div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-1 h-full w-full"
          >
            <div className="mb-5 flex flex-col gap-2">
              <div className="relative">
                <Mail className="absolute z-50 top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
                <input
                  className="input input-success pl-10"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  value={email}
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                />
              </div>
              <div className="relative">
                <Lock className="absolute z-10 top-1/2 left-3 -translate-y-1/2 pointer-events-none" />
                <input
                  className="input input-success pl-10"
                  type="password"
                  value={password}
                  name="password"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter your password..."
                />
              </div>
            </div>
            <button className="btn btn-outline btn-success" type="submit">
              Login
            </button>
            {error && (
              <div>
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
