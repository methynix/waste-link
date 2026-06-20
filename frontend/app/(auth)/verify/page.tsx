"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp, requestOtp } from "@/services/auth";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";

export default function VerifyPage() {
  const tx = useTx();
  const router = useRouter();
  const [phone, setPhone] = useState(() => {
    try {
      return localStorage.getItem("mali-pending-phone") || "";
    } catch {
      return "";
    }
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const ok = await verifyOtp(phone, code);
      if (ok) router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError(null);
    setInfo(null);
    try {
      await requestOtp(phone);
      setInfo(tx("Tumekutumia namba mpya.", "We sent you a new code."));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="card auth-card">
      <h1 className="auth-title">{tx("Thibitisha simu", "Verify your phone")}</h1>
      <p className="auth-sub">
        {tx("Weka namba uliyotumiwa kwa SMS.", "Enter the code we sent you by SMS.")}
      </p>
      {error ? <Alert>{error}</Alert> : null}
      {info ? <Alert kind="ok">{info}</Alert> : null}
      <form className="form" onSubmit={onSubmit}>
        <Field label={tx("Namba ya simu", "Phone number")}>
          <input
            className="input"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Field>
        <Field label={tx("Namba ya uthibitisho", "Verification code")}>
          <input
            className="input"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            required
          />
        </Field>
        <button className="btn btn-blue btn-block" disabled={busy}>
          {busy ? tx("Inathibitisha…", "Verifying…") : tx("Thibitisha", "Verify")}
        </button>
      </form>
      <p className="auth-foot">
        <button className="linklike" type="button" onClick={resend}>
          {tx("Tuma namba tena", "Resend code")}
        </button>
      </p>
    </div>
  );
}
