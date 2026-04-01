import { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

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
      <div>
        <h2 className="text-4xl">LOGIN</h2>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-1 h-full">
          <input
            className="input input-success"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            value={email}
            type="email"
            name="email"
          />
          <input
            className="input input-success"
            type="password"
            value={password}
            name="password"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
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
  );
}

export default LoginPage;
