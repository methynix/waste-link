"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createListing,
  listings as fetchListings,
  makeOffer,
  materials as fetchMaterials,
  myListings as fetchMyListings,
} from "@/services/market";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { MaterialCategory, RecyclingListing } from "@/types";

export default function MarketPage() {
  const tx = useTx();
  const [materials, setMaterials] = useState<MaterialCategory[]>([]);
  const [listings, setListings] = useState<RecyclingListing[]>([]);
  const [mine, setMine] = useState<RecyclingListing[]>([]);
  const [materialId, setMaterialId] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [mats, list, own] = await Promise.all([
        fetchMaterials(),
        fetchListings(),
        fetchMyListings(),
      ]);
      setMaterials(mats);
      setListings(list);
      setMine(own);
      if (!materialId && mats.length) setMaterialId(mats[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [materialId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setBusy(true);
    try {
      await createListing({ materialId, weightKg, askingPrice, locationAddress });
      setOk(tx("Tangazo limewekwa.", "Your listing is live."));
      setWeightKg("");
      setAskingPrice("");
      setLocationAddress("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onOffer(id: string) {
    const price = window.prompt(tx("Weka bei yako (TSh)", "Enter your offer (TSh)"));
    if (!price) return;
    setError(null);
    try {
      await makeOffer(id, price);
      setOk(tx("Bei yako imetumwa.", "Your offer was sent."));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">{tx("Soko la kuchakata", "Recycling market")}</h1>
      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert kind="ok">{ok}</Alert> : null}

      <div className="panel">
        <h2 className="panel-title">{tx("Weka tangazo", "Post a listing")}</h2>
        <form className="form" onSubmit={onCreate}>
          <Field label={tx("Bidhaa", "Material")}>
            <select className="select" value={materialId} onChange={(e) => setMaterialId(e.target.value)} required>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>{tx(m.nameSw || m.name, m.name)}</option>
              ))}
            </select>
          </Field>
          <Field label={tx("Uzito (kg)", "Weight (kg)")}>
            <input className="input" inputMode="decimal" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
          </Field>
          <Field label={tx("Bei unayotaka (TSh)", "Asking price (TSh)")}>
            <input className="input" inputMode="decimal" value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} required />
          </Field>
          <Field label={tx("Mahali", "Location")}>
            <input className="input" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} required />
          </Field>
          <button className="btn btn-blue btn-block" disabled={busy}>
            {busy ? tx("Inaweka…", "Posting…") : tx("Weka tangazo", "Post listing")}
          </button>
        </form>
      </div>

      <h2 className="page-sub">{tx("Matangazo yaliyopo", "Available listings")}</h2>
      {listings.length === 0 ? (
        <p className="empty">{tx("Hakuna matangazo kwa sasa.", "No listings right now.")}</p>
      ) : (
        <div className="cards">
          {listings.map((l) => (
            <div className="card row-card" key={l.id}>
              <div>
                <div className="row-title">{l.weightKg} kg · {tx(l.material.nameSw || l.material.name, l.material.name)}</div>
                <div className="row-meta">TSh {l.askingPrice} · {l.locationAddress}</div>
              </div>
              <button className="btn btn-lime btn-sm" onClick={() => onOffer(l.id)}>
                {tx("Toa bei", "Make offer")}
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="page-sub">{tx("Matangazo yako", "Your listings")}</h2>
      {mine.length === 0 ? (
        <p className="empty">{tx("Bado huna tangazo.", "You have no listings yet.")}</p>
      ) : (
        <div className="cards">
          {mine.map((l) => (
            <div className="card row-card" key={l.id}>
              <div>
                <div className="row-title">{l.weightKg} kg · {tx(l.material.nameSw || l.material.name, l.material.name)}</div>
                <div className="row-meta">TSh {l.askingPrice}</div>
              </div>
              <StatusBadge status={l.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
