"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createPickup, estimatePickup, myJobs } from "@/services/collect";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { CollectionJob, Volume, WasteType } from "@/types";

const WASTE_TYPES: [WasteType, string, string][] = [
  ["household", "Taka za nyumbani", "Household"],
  ["commercial", "Taka za biashara", "Commercial"],
  ["industrial", "Taka za viwandani", "Industrial"],
  ["hazardous", "Taka hatari", "Hazardous"],
  ["recyclable", "Za kuchakata tu", "Recyclable only"],
];

const VOLUMES: [Volume, string, string][] = [
  ["small", "Ndogo (mifuko michache)", "Small (a few bags)"],
  ["medium", "Wastani (pipa)", "Medium (a bin)"],
  ["large", "Kubwa (mkokoteni)", "Large (a cart load)"],
  ["xlarge", "Kubwa sana (lori)", "Extra large (a truck)"],
];

export default function GeneratorPage() {
  const tx = useTx();
  const [wasteType, setWasteType] = useState<WasteType>("household");
  const [volume, setVolume] = useState<Volume>("small");
  const [preferredTime, setPreferredTime] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [estimate, setEstimate] = useState<string | null>(null);
  const [jobs, setJobs] = useState<CollectionJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setJobs(await myJobs());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let active = true;
    estimatePickup(wasteType, volume)
      .then((value) => {
        if (active) setEstimate(value);
      })
      .catch(() => {
        if (active) setEstimate(null);
      });
    return () => {
      active = false;
    };
  }, [wasteType, volume]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setBusy(true);
    try {
      await createPickup({
        wasteType,
        volume,
        preferredTime: new Date(preferredTime).toISOString(),
        pickupAddress,
      });
      setOk(tx("Ombi limetumwa. Tunatafuta mkusanyaji.", "Request sent. We are finding a collector."));
      setPickupAddress("");
      setPreferredTime("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">{tx("Omba kuchukuliwa taka", "Request a waste pickup")}</h1>

      <div className="panel">
        {error ? <Alert>{error}</Alert> : null}
        {ok ? <Alert kind="ok">{ok}</Alert> : null}
        <form className="form" onSubmit={onSubmit}>
          <Field label={tx("Aina ya taka", "Waste type")}>
            <select className="select" value={wasteType} onChange={(e) => setWasteType(e.target.value as WasteType)}>
              {WASTE_TYPES.map(([v, sw, en]) => (
                <option key={v} value={v}>{tx(sw, en)}</option>
              ))}
            </select>
          </Field>
          <Field label={tx("Kiasi", "Amount")}>
            <select className="select" value={volume} onChange={(e) => setVolume(e.target.value as Volume)}>
              {VOLUMES.map(([v, sw, en]) => (
                <option key={v} value={v}>{tx(sw, en)}</option>
              ))}
            </select>
          </Field>
          <Field label={tx("Muda unaopendelea", "Preferred time")}>
            <input className="input" type="datetime-local" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} required />
          </Field>
          <Field label={tx("Mahali pa kuchukulia", "Pickup address")}>
            <input className="input" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder={tx("Mtaa, nyumba, alama", "Street, house, landmark")} required />
          </Field>
          <p className="estimate">
            {tx("Makadirio ya bei", "Estimated price")}: <strong>{estimate && Number(estimate) > 0 ? `TSh ${estimate}` : tx("itapatikana wakati wa kuthibitisha", "set at confirmation")}</strong>
          </p>
          <button className="btn btn-blue btn-block" disabled={busy}>
            {busy ? tx("Inatuma…", "Sending…") : tx("Omba sasa", "Request now")}
          </button>
        </form>
      </div>

      <h2 className="page-sub">{tx("Maombi yako", "Your requests")}</h2>
      {jobs.length === 0 ? (
        <p className="empty">{tx("Bado hujaweka ombi.", "You have no requests yet.")}</p>
      ) : (
        <div className="cards">
          {jobs.map((job) => (
            <div className="card row-card" key={job.id}>
              <div>
                <div className="row-title">{job.wasteType} · {job.volume}</div>
                <div className="row-meta">{job.pickupAddress}</div>
              </div>
              <StatusBadge status={job.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
