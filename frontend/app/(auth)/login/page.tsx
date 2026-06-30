"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordField";
import { Alert } from "@/components/ui/Alert";

type Method = "phone" | "email";

export default function LoginPage() {
  const tx = useTx();
  const router = useRouter();
  const { reload } = useAuth();
  const [method, setMethod] = useState<Method>("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(identifier.trim(), password);
      await reload();
      router.push("/dashboard");
    } catch {
      setError(
        method === "phone"
          ? tx("Simu au nenosiri si sahihi.", "Phone or password is incorrect.")
          : tx("Barua pepe au nenosiri si sahihi.", "Email or password is incorrect.")
      );
    } finally {
      setBusy(false);
    }
  }

  function switchMethod(next: Method) {
    setMethod(next);
    setIdentifier("");
  }

  return (
    <div className="card auth-card">
      <h1 className="auth-title">{tx("Karibu tena", "Welcome back")}</h1>
      <p className="auth-sub">{tx("Ingia kwenye akaunti yako.", "Log in to your account.")}</p>
      {error ? <Alert>{error}</Alert> : null}

      <div className="seg-toggle" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={method === "phone"}
          className={method === "phone" ? "seg-btn active" : "seg-btn"}
          onClick={() => switchMethod("phone")}
        >
          {tx("Simu", "Phone")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={method === "email"}
          className={method === "email" ? "seg-btn active" : "seg-btn"}
          onClick={() => switchMethod("email")}
        >
          {tx("Barua pepe", "Email")}
        </button>
      </div>

      <form className="form" onSubmit={onSubmit}>
        {method === "phone" ? (
          <Field label={tx("Namba ya simu", "Phone number")}>
            <input
              className="input"
              inputMode="tel"
              autoComplete="tel"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="07XXXXXXXX"
              required
            />
          </Field>
        ) : (
          <Field label={tx("Barua pepe", "Email address")}>
            <input
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="jina@mfano.com"
              required
            />
          </Field>
        )}
        <Field label={tx("Nenosiri", "Password")}>
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
            showLabel={tx("Onyesha nenosiri", "Show password")}
            hideLabel={tx("Ficha nenosiri", "Hide password")}
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
