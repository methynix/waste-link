"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { clearToken, fetchMe } from "@/services/auth";
import type { User } from "@/types";

interface AuthValue {
  user: User | null;
  loading: boolean;
  reload: () => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthValue>({
  user: null,
  loading: true,
  reload: async () => {},
  signOut: () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const signOut = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, reload, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
