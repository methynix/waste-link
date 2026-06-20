"use client";

import { useTx } from "@/hooks/useTx";

const LABELS: Record<string, [string, string]> = {
  searching: ["Inatafuta", "Searching"],
  accepted: ["Imekubaliwa", "Accepted"],
  en_route: ["Njiani", "En route"],
  arrived: ["Amefika", "Arrived"],
  collected: ["Imekusanywa", "Collected"],
  completed: ["Imekamilika", "Completed"],
  cancelled: ["Imeghairiwa", "Cancelled"],
  active: ["Hai", "Active"],
  negotiating: ["Mnapatana", "Negotiating"],
  sold: ["Imeuzwa", "Sold"],
};

export function StatusBadge({ status }: { status: string }) {
  const tx = useTx();
  const pair = LABELS[status];
  const label = pair ? tx(pair[0], pair[1]) : status;
  return <span className={`badge badge-${status}`}>{label}</span>;
}
