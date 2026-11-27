"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const BACKEND_URL_STORAGE_KEY = "coachai_backend_url_v1";
const DEFAULT_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || "http://127.0.0.1:8000";
const AUTH_TOKEN_STORAGE_KEY = "coachai_auth_token_v1";
const AUTH_COACH_STORAGE_KEY = "coachai_auth_coach_v1";

export type CoachRole = "Head Coach" | "Assistant Coach" | "Fitness Coach";

export interface CoachProfile {
  id: string;
  full_name: string;
  email: string;
  role: CoachRole | string;
  assigned_age_groups: string[];
  specialty: string;
  created_at: string;
}

export interface RegisterCoachInput {
  full_name: string;
  email: string;
  password: string;
  role: CoachRole;
  assigned_age_groups: string[];
  specialty: string;
}

export interface UpdateCoachInput {
  full_name?: string;
  role?: CoachRole;
  assigned_age_groups?: string[];
  specialty?: string;
}

interface AuthContextValue {
  coach: CoachProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterCoachInput) => Promise<void>;
  updateProfile: (input: UpdateCoachInput) => Promise<void>;
  deleteAccount: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function getBackendBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BACKEND_URL.replace(/\/+$/, "");
  return (
    localStorage.getItem(BACKEND_URL_STORAGE_KEY)?.trim() ||
    DEFAULT_BACKEND_URL
  ).replace(/\/+$/, "");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [coach, setCoach] = useState<CoachProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearSession = useCallback(() => {
    setCoach(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(AUTH_COACH_STORAGE_KEY);
    }
  }, []);

  const persistSession = useCallback(
    (nextToken: string, nextCoach: CoachProfile) => {
      setToken(nextToken);
      setCoach(nextCoach);
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, nextToken);
        localStorage.setItem(
          AUTH_COACH_STORAGE_KEY,
          JSON.stringify(nextCoach)
        );
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const storedCoachRaw = localStorage.getItem(AUTH_COACH_STORAGE_KEY);

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    if (storedCoachRaw) {
      try {
        setCoach(JSON.parse(storedCoachRaw) as CoachProfile);
      } catch {
        // Ignore malformed cache
      }
    }

    async function verifyToken(activeToken: string) {
      try {
        const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        });

        if (res.status === 401 || res.status === 404) {
          clearSession();
          return;
        }

        if (res.ok) {
          const freshProfile = (await res.json()) as CoachProfile;
          persistSession(activeToken, freshProfile);
        }
      } catch {
        // Keep cached session if backend is temporarily unreachable
      } finally {
        setIsLoading(false);
      }
    }

    void verifyToken(storedToken);
  }, [clearSession, persistSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          detail?: string;
        };
        throw new Error(err.detail || "Invalid email or password.");
      }

      const data = (await res.json()) as {
        access_token: string;
        coach: CoachProfile;
      };
      persistSession(data.access_token, data.coach);
    },
    [persistSession]
  );

  const register = useCallback(
    async (input: RegisterCoachInput) => {
      const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          detail?: string;
        };
        throw new Error(err.detail || "Could not create coach account.");
      }

      const data = (await res.json()) as {
        access_token: string;
        coach: CoachProfile;
      };
      persistSession(data.access_token, data.coach);
    },
    [persistSession]
  );

  const updateProfile = useCallback(
    async (input: UpdateCoachInput) => {
      if (!token) {
        throw new Error("You must be signed in to update your profile.");
      }

      const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          detail?: string;
        };
        throw new Error(err.detail || "Failed to update coach profile.");
      }

      const updated = (await res.json()) as CoachProfile;
      persistSession(token, updated);
    },
    [persistSession, token]
  );

  const deleteAccount = useCallback(async () => {
    if (!token) {
      clearSession();
      return;
    }

    const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok && res.status !== 404) {
      const err = (await res.json().catch(() => ({}))) as {
        detail?: string;
      };
      throw new Error(err.detail || "Failed to delete coach profile.");
    }

    clearSession();
  }, [clearSession, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      coach,
      token,
      isLoading,
      login,
      register,
      updateProfile,
      deleteAccount,
      logout: clearSession,
    }),
    [
      coach,
      token,
      isLoading,
      login,
      register,
      updateProfile,
      deleteAccount,
      clearSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}