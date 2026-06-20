"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { requestPasswordReset } from "@/services/auth";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";

export default function ForgotPasswordPage() {
  const tx = useTx();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await requestPasswordReset(email);
      try {
        localStorage.setItem("mali-reset-email", email);
      } catch {}
      router.push("/reset-password");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card auth-card">
      <h1 className="auth-title">{tx("Umesahau nenosiri?", "Forgot password?")}</h1>
      <p className="auth-sub">
        {tx(
          "Weka barua pepe yako. Tutakutumia namba ya kubadili nenosiri.",
          "Enter your email. We will send you a code to reset your password."
        )}
      </p>
      {error ? <Alert>{error}</Alert> : null}
      <form className="form" onSubmit={onSubmit}>
        <Field label={tx("Barua pepe", "Email address")}>
          <input
            className="input"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jina@mfano.com"
            required
          />
        </Field>
        <button className="btn btn-blue btn-block" disabled={busy}>
          {busy ? tx("Inatuma…", "Sending…") : tx("Tuma namba", "Send code")}
        </button>
      </form>
      <p className="auth-foot">
        <Link href="/login">{tx("Rudi kuingia", "Back to log in")}</Link>
      </p>
    </div>
  );
}
