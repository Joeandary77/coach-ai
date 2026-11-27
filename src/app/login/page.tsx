"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  LogIn,
  LogOut,
  Save,
  ShieldCheck,
  Trash2,
  UserCircle2,
  UserPlus,
} from "lucide-react";

import {
  useAuth,
  type CoachRole,
} from "@/components/providers/auth-provider";

const AGE_GROUPS = ["U8", "U10", "U12 (B)", "U12 (A)", "U14-16"];
const ROLES: CoachRole[] = ["Head Coach", "Assistant Coach", "Fitness Coach"];

export default function CoachLoginPage() {
  const router = useRouter();
  const {
    coach,
    isLoading,
    login,
    register,
    updateProfile,
    deleteAccount,
    logout,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auth form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<CoachRole>("Assistant Coach");
  const [specialty, setSpecialty] = useState("Basketball Fundamentals");
  const [selectedGroups, setSelectedGroups] = useState<string[]>(["U12 (A)"]);

  // Sync edit form when coach is signed in
  useEffect(() => {
    if (!coach) return;
    setFullName(coach.full_name);
    setRole((coach.role as CoachRole) || "Assistant Coach");
    setSpecialty(coach.specialty || "Basketball Fundamentals");
    setSelectedGroups(
      coach.assigned_age_groups?.length ? coach.assigned_age_groups : ["U12 (A)"]
    );
  }, [coach]);

  function toggleAgeGroup(group: string) {
    setSelectedGroups((prev) =>
      prev.includes(group)
        ? prev.length > 1
          ? prev.filter((g) => g !== group)
          : prev
        : [...prev, group]
    );
  }

  async function handleAuthSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
        router.push("/");
      } else {
        await register({
          full_name: fullName,
          email,
          password,
          role,
          assigned_age_groups: selectedGroups,
          specialty,
        });
        router.push("/");
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Authentication failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleProfileSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      await updateProfile({
        full_name: fullName,
        role,
        assigned_age_groups: selectedGroups,
        specialty,
      });
      setSuccessMsg("Coach profile updated and synced to MongoDB.");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Could not update profile."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProfile() {
    setErrorMsg(null);
    setSuccessMsg(null);
    setDeleting(true);

    try {
      await deleteAccount();
      setConfirmDelete(false);
      setEmail("");
      setPassword("");
      setMode("login");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Could not delete coach profile."
      );
    } finally {
      setDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center text-sm text-muted-foreground">
        Loading coach session...
      </div>
    );
  }

  if (coach) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>Authenticated Academy Staff</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Coach Profile &amp; Division Assignments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your name and role are automatically attached to every session
            report you log.
          </p>
        </div>

        <form
          onSubmit={(e) => void handleProfileSave(e)}
          className="space-y-5 rounded-2xl border bg-card p-6 shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-base font-bold text-primary">
                {coach.full_name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="font-bold">{coach.full_name}</p>
                <p className="text-xs text-muted-foreground">{coach.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Academy Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as CoachRole)}
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Coaching Specialty
            </label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g., Ball Handling & Footwork, U12 Conditioning"
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              Assigned Age Divisions
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((group) => {
                const active = selectedGroups.includes(group);
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => toggleAgeGroup(group)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {group}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || deleting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-orange-400 disabled:opacity-40"
          >
            <Save className="h-4 w-4" />
            {submitting ? "Saving..." : "Save Profile Changes"}
          </button>
        </form>

        {/* Danger Zone: Delete Profile */}
        <div className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-destructive">
                Delete Coach Profile
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Permanently remove this coach account from MongoDB. Existing
                session reports will remain preserved.
              </p>
            </div>

            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 px-3.5 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-xl border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void handleDeleteProfile()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-destructive px-3.5 py-2 text-xs font-semibold text-destructive-foreground transition hover:opacity-90 disabled:opacity-40"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <UserCircle2 className="h-4 w-4" />
          <span>Academy Staff Access</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
          {mode === "login" ? "Coach Sign In" : "Create Coach Account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in with your academy profile to attribute session reports and
          manage your assigned divisions.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 rounded-xl border bg-muted/50 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMsg(null);
          }}
          className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
            mode === "login"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setErrorMsg(null);
          }}
          className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
            mode === "register"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserPlus className="h-3.5 w-3.5" />
          New Coach Profile
        </button>
      </div>

      <form
        onSubmit={(e) => void handleAuthSubmit(e)}
        className="space-y-4 rounded-2xl border bg-card p-6 shadow-xs"
      >
        {errorMsg && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
            {errorMsg}
          </div>
        )}

        {mode === "register" && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Coach Joseph Andary"
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="coach@academy.com"
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {mode === "register" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Academy Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as CoachRole)}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Specialty
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                Assigned Age Groups
              </label>
              <div className="flex flex-wrap gap-2">
                {AGE_GROUPS.map((group) => {
                  const active = selectedGroups.includes(group);
                  return (
                    <button
                      key={group}
                      type="button"
                      onClick={() => toggleAgeGroup(group)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-orange-400 disabled:opacity-40"
        >
          {mode === "login" ? (
            <>
              <LogIn className="h-4 w-4" />
              {submitting ? "Signing In..." : "Sign In to Workspace"}
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              {submitting ? "Creating Profile..." : "Create Coach Profile"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}