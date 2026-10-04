import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

import type {
  User,
  UserRole,
  LoginRequest,
  RegisterRequest,
} from '@/types';

import * as authApi from '@/services/authApi';
import { getToken, clearToken } from '@/services/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (req: LoginRequest) => Promise<User>;
  register: (req: RegisterRequest) => Promise<User>;

  demoLogin: (role: UserRole) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  // =========================================================
  // CHECK CURRENT LOGIN WHEN APP STARTS
  // =========================================================
  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        // Invalid/expired token
        clearToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================
  const login = useCallback(
    async (req: LoginRequest): Promise<User> => {
      const response = await authApi.login(req);

      setUser(response.user);

      return response.user;
    },
    [],
  );

  // =========================================================
  // STUDENT REGISTER
  // =========================================================
  const register = useCallback(
    async (req: RegisterRequest): Promise<User> => {
      const response = await authApi.register(req);

      setUser(response.user);

      return response.user;
    },
    [],
  );

  // =========================================================
  // DEMO LOGIN
  // =========================================================
  const demoLogin = useCallback(
    async (role: UserRole) => {
      const response = await authApi.demoLogin(role);

      setUser(response.user);
    },
    [],
  );

  // =========================================================
  // LOGOUT
  // =========================================================
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      /*
       * IMPORTANT:
       * Only remove the login token.
       *
       * We DO NOT remove:
       * - users
       * - requests
       * - notifications
       * - documents
       * - history
       *
       * All of that remains in MySQL.
       */
      clearToken();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// USE AUTH
// =========================================================
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    );
  }

  return context;
}