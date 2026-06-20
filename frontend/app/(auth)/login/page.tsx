"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";

export default function LoginPage() {
  const tx = useTx();
  const router = useRouter();
  const { reload } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(phone, password);
      await reload();
      router.push("/dashboard");
    } catch {
      setError(tx("Simu au nenosiri si sahihi.", "Phone or password is incorrect."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card auth-card">
      <h1 className="auth-title">{tx("Karibu tena", "Welcome back")}</h1>
      <p className="auth-sub">{tx("Ingia kwenye akaunti yako.", "Log in to your account.")}</p>
      {error ? <Alert>{error}</Alert> : null}
      <form className="form" onSubmit={onSubmit}>
        <Field label={tx("Namba ya simu", "Phone number")}>
          <input
            className="input"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07XXXXXXXX"
            required
          />
        </Field>
        <Field label={tx("Nenosiri", "Password")}>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <button className="btn btn-blue btn-block" disabled={busy}>
          {busy ? tx("Inaingia…", "Logging in…") : tx("Ingia", "Log in")}
        </button>
      </form>
      <p className="auth-foot">
        <Link href="/forgot-password">{tx("Umesahau nenosiri?", "Forgot password?")}</Link>
      </p>
      <p className="auth-foot">
        {tx("Huna akaunti?", "No account yet?")}{" "}
        <Link href="/register">{tx("Jisajili", "Sign up")}</Link>
      </p>
    </div>
  );
}
