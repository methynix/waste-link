"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register, requestOtp } from "@/services/auth";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import type { Role } from "@/types";

export default function RegisterPage() {
  const tx = useTx();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("waste_generator");
  const [collectorType, setCollectorType] = useState("normal");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register({
        phone,
        email,
        password,
        role,
        collectorType: role === "collector" ? collectorType : undefined,
      });
      await requestOtp(phone);
      try {
        localStorage.setItem("mali-pending-phone", phone);
      } catch {}
      router.push("/verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card auth-card">
      <h1 className="auth-title">{tx("Fungua akaunti", "Create an account")}</h1>
      <p className="auth-sub">
        {tx("Jisajili kwa namba yako ya simu.", "Register with your phone number.")}
      </p>
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
        <Field label={tx("Barua pepe", "Email address")} hint={tx("Tutakutumia ujumbe wa karibu na kukusaidia kurejesha nenosiri.", "We use this for your welcome message and password reset.")}>
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
        <Field label={tx("Nenosiri", "Password")}>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Field label={tx("Wewe ni nani?", "What is your role?")}>
          <select
            className="select"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="waste_generator">{tx("Nina taka", "I have waste")}</option>
            <option value="collector">{tx("Nakusanya taka", "I collect waste")}</option>
            <option value="recycler">{tx("Nanunua vitu vya kuchakata", "I buy recyclables")}</option>
          </select>
        </Field>
        {role === "collector" ? (
          <Field label={tx("Aina ya ukusanyaji", "Collector type")}>
            <select
              className="select"
              value={collectorType}
              onChange={(e) => setCollectorType(e.target.value)}
            >
              <option value="normal">{tx("Mkokoteni / mkono", "Pushcart / on foot")}</option>
              <option value="truck_driver">{tx("Dereva wa lori", "Truck driver")}</option>
            </select>
          </Field>
        ) : null}
        <button className="btn btn-blue btn-block" disabled={busy}>
          {busy ? tx("Inafungua…", "Creating…") : tx("Endelea", "Continue")}
        </button>
      </form>
      <p className="auth-foot">
        {tx("Una akaunti tayari?", "Already have an account?")}{" "}
        <Link href="/login">{tx("Ingia", "Log in")}</Link>
      </p>
    </div>
  );
}
