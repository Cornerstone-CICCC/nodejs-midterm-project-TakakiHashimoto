import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthContextType,
  SignupInput,
  User,
} from "../../features/auth/types";
import { getMe, login, logout, signup } from "../../features/auth/api/auth.api";
import type { LoginInput } from "../../features/auth/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: ReactNode };

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const restoreAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMe();
      setUser(data);
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginFn = useCallback(async (input: LoginInput) => {
    const data = await login(input);
    setUser(data.data);
  }, []);

  const signupFn = useCallback(async (input: SignupInput) => {
    const data = await signup(input);
    setUser(data.data);
  }, []);

  const logoutFn = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login: loginFn,
      signup: signupFn,
      logout: logoutFn,
      restoreAuth,
    }),
    [user, isLoading, loginFn, signupFn, logoutFn, restoreAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
