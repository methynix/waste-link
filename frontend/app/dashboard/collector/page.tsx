"use client";

import { useCallback, useEffect, useState } from "react";
import { acceptJob, assignedJobs, openJobs, updateJobStatus } from "@/services/collect";
import { useTx } from "@/hooks/useTx";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { CollectionJob, JobStatus } from "@/types";

const NEXT_STATUS: Partial<Record<JobStatus, JobStatus>> = {
  accepted: "en_route",
  en_route: "arrived",
  arrived: "collected",
  collected: "completed",
};

const NEXT_LABEL: Record<string, [string, string]> = {
  en_route: ["Niko njiani", "On my way"],
  arrived: ["Nimefika", "I have arrived"],
  collected: ["Nimekusanya", "Collected"],
  completed: ["Maliza", "Finish"],
};

export default function CollectorPage() {
  const tx = useTx();
  const [open, setOpen] = useState<CollectionJob[]>([]);
  const [mine, setMine] = useState<CollectionJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [o, m] = await Promise.all([openJobs(), assignedJobs()]);
      setOpen(o);
      setMine(m);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onAccept(id: string) {
    setBusy(id);
    setError(null);
    try {
      await acceptJob(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  async function onAdvance(job: CollectionJob) {
    const next = NEXT_STATUS[job.status];
    if (!next) return;
    setBusy(job.id);
    setError(null);
    try {
      await updateJobStatus(job.id, next);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">{tx("Kazi za ukusanyaji", "Collection jobs")}</h1>
      {error ? <Alert>{error}</Alert> : null}

      <h2 className="page-sub">{tx("Kazi zilizo wazi karibu nawe", "Open jobs near you")}</h2>
      {open.length === 0 ? (
        <p className="empty">{tx("Hakuna kazi wazi kwa sasa.", "No open jobs right now.")}</p>
      ) : (
        <div className="cards">
          {open.map((job) => (
            <div className="card row-card" key={job.id}>
              <div>
                <div className="row-title">{job.wasteType} · {job.volume}</div>
                <div className="row-meta">{job.pickupAddress}</div>
              </div>
              <button className="btn btn-lime btn-sm" disabled={busy === job.id} onClick={() => onAccept(job.id)}>
                {busy === job.id ? tx("…", "…") : tx("Kubali", "Accept")}
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="page-sub">{tx("Kazi zako", "Your jobs")}</h2>
      {mine.length === 0 ? (
        <p className="empty">{tx("Bado huna kazi.", "You have no jobs yet.")}</p>
      ) : (
        <div className="cards">
          {mine.map((job) => {
            const next = NEXT_STATUS[job.status];
            const label = next ? NEXT_LABEL[next] : null;
            return (
              <div className="card row-card" key={job.id}>
                <div>
                  <div className="row-title">{job.wasteType} · {job.volume}</div>
                  <div className="row-meta">{job.pickupAddress}</div>
                  <StatusBadge status={job.status} />
                </div>
                {next && label ? (
                  <button className="btn btn-blue btn-sm" disabled={busy === job.id} onClick={() => onAdvance(job)}>
                    {tx(label[0], label[1])}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
