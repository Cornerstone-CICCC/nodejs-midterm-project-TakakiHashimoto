import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { signup } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = { email, password, username };
    try {
      await signup(data);
      navigate("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to log you in");
    }
  }

  useEffect(() => setError(null), []);
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div>
        <h2>LOGIN</h2>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-1 h-full">
          <input
            placeholder="username"
            className="input input-success "
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            value={username}
            type="text"
            name="username"
          />
          <input
            placeholder="email"
            className="input input-success"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            value={email}
            type="email"
            name="email"
          />
          <input
            placeholder="password"
            className="input input-success"
            type="password"
            value={password}
            name="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <button className="btn btn-outline btn-success" type="submit">
            Signup
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

export default SignupPage;
