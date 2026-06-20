"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/services/auth";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";

export default function ResetPasswordPage() {
  const tx = useTx();
  const router = useRouter();
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("mali-reset-email") || "";
    } catch {
      return "";
    }
  });
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const ok = await resetPassword(email, code, newPassword);
      if (ok) {
        try {
          localStorage.removeItem("mali-reset-email");
        } catch {}
        router.push("/login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card auth-card">
      <h1 className="auth-title">{tx("Weka nenosiri jipya", "Set a new password")}</h1>
      <p className="auth-sub">
        {tx(
          "Weka namba uliyotumiwa kwa barua pepe na nenosiri jipya.",
          "Enter the code we emailed you and your new password."
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
            required
          />
        </Field>
        <Field label={tx("Namba kutoka barua pepe", "Code from email")}>
          <input
            className="input"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            required
          />
        </Field>
        <Field label={tx("Nenosiri jipya", "New password")}>
          <input
            className="input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Field>
        <button className="btn btn-blue btn-block" disabled={busy}>
          {busy ? tx("Inabadili…", "Saving…") : tx("Badili nenosiri", "Change password")}
        </button>
      </form>
      <p className="auth-foot">
        <Link href="/login">{tx("Rudi kuingia", "Back to log in")}</Link>
      </p>
    </div>
  );
}
