type User = { id: string; username: string; email: string };

type LoginInput = { email: string; password: string };

type SignupInput = { email: string; username: string; password: string };

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  restoreAuth: () => Promise<void>;
};

export type { User, LoginInput, SignupInput, AuthContextType };
