"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { clearToken, devLogin, fetchMe } from "@/services/auth";
import { getToken } from "@/services/api";
import type { User } from "@/types";

const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";
const BYPASS_ROLE = process.env.NEXT_PUBLIC_BYPASS_ROLE || "waste_generator";

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
      // Tester bypass: if enabled and not already signed in, auto-log-in as a
      // seeded test user so the login screen can be skipped.
      if (BYPASS_AUTH && !getToken()) {
        await devLogin(BYPASS_ROLE);
      }
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
