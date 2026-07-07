"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { initiateDeposit, myTransactions, myWallet, requestWithdrawal } from "@/services/wallet";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import type { Transaction, Wallet } from "@/types";

export default function WalletPage() {
  const tx = useTx();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositPhone, setDepositPhone] = useState("");
  const [depositBusy, setDepositBusy] = useState(false);

  const [amount, setAmount] = useState("");
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [w, t] = await Promise.all([myWallet(), myTransactions()]);
      setWallet(w);
      setTxs(t);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onDeposit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setDepositBusy(true);
    try {
      const result = await initiateDeposit(depositAmount, depositPhone);
      setOk(result.message);
      setDepositAmount("");
      setDepositPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDepositBusy(false);
    }
  }

  async function onWithdraw(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setBusy(true);
    try {
      await requestWithdrawal(amount, mobileMoneyNumber);
      setOk(tx("Ombi la kutoa pesa limetumwa.", "Withdrawal request sent."));
      setAmount("");
      setMobileMoneyNumber("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">{tx("Pochi yako", "Your wallet")}</h1>
      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert kind="ok">{ok}</Alert> : null}

      <div className="stats">
        <div className="stat">
          <span className="stat-label">{tx("Salio", "Balance")}</span>
          <span className="stat-value">TSh {wallet ? wallet.balance : "—"}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{tx("Inashikiliwa", "Held")}</span>
          <span className="stat-value">TSh {wallet ? wallet.held : "—"}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{tx("Jumla iliyopatikana", "Total earned")}</span>
          <span className="stat-value">TSh {wallet ? wallet.totalEarned : "—"}</span>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">{tx("Weka pesa", "Deposit")}</h2>
        <form className="form" onSubmit={onDeposit}>
          <Field label={tx("Kiasi (TSh)", "Amount (TSh)")}>
            <input
              className="input"
              inputMode="decimal"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
            />
          </Field>
          <Field label={tx("Namba ya M-Pesa/Airtel", "Mobile money number")}>
            <input
              className="input"
              inputMode="tel"
              value={depositPhone}
              onChange={(e) => setDepositPhone(e.target.value)}
              placeholder="07XXXXXXXX"
              required
            />
          </Field>
          <button className="btn btn-green btn-block" disabled={depositBusy}>
            {depositBusy
              ? tx("Inatuma…", "Sending…")
              : tx("Weka pesa", "Deposit via AzamPay")}
          </button>
        </form>
      </div>

      <div className="panel">
        <h2 className="panel-title">{tx("Toa pesa", "Withdraw")}</h2>
        <form className="form" onSubmit={onWithdraw}>
          <Field label={tx("Kiasi (TSh)", "Amount (TSh)")}>
            <input className="input" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Field>
          <Field label={tx("Namba ya pesa za simu", "Mobile money number")}>
            <input className="input" inputMode="tel" value={mobileMoneyNumber} onChange={(e) => setMobileMoneyNumber(e.target.value)} placeholder="07XXXXXXXX" required />
          </Field>
          <button className="btn btn-blue btn-block" disabled={busy}>
            {busy ? tx("Inatuma…", "Sending…") : tx("Toa pesa", "Withdraw")}
          </button>
        </form>
      </div>

      <h2 className="page-sub">{tx("Miamala", "Transactions")}</h2>
      {txs.length === 0 ? (
        <p className="empty">{tx("Bado hakuna miamala.", "No transactions yet.")}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>{tx("Aina", "Type")}</th>
              <th>{tx("Kiasi", "Amount")}</th>
              <th>{tx("Hali", "Status")}</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id}>
                <td>{t.transactionType}</td>
                <td>TSh {t.amount}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
