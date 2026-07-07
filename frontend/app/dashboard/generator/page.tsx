"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  confirmCompletion,
  createPickup,
  estimatePickup,
  myJobs,
  paymentConfig,
} from "@/services/collect";
import { useTx } from "@/hooks/useTx";
import { Field } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { CollectionJob, PaymentMethod, Volume, WasteType } from "@/types";

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
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [mobileEnabled, setMobileEnabled] = useState(false);
  const [mobilePopup, setMobilePopup] = useState(false);
  const [estimate, setEstimate] = useState<string | null>(null);
  const [jobs, setJobs] = useState<CollectionJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  function chooseMobile() {
    if (mobileEnabled) {
      setPaymentMethod("mobile");
    } else {
      // Not available yet — show the popup and keep cash selected.
      setMobilePopup(true);
    }
  }

  function useMyLocation() {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError(tx("Kifaa chako hakiruhusu eneo.", "Your device does not support location."));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        // Try to fill a human-readable address; fall back to coordinates.
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { Accept: "application/json" } }
          );
          const data = await res.json();
          setPickupAddress(
            data?.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
          );
        } catch {
          setPickupAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError(
          tx(
            "Imeshindikana kupata eneo. Ruhusu eneo kisha jaribu tena.",
            "Could not get your location. Allow location access and try again."
          )
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const load = useCallback(async () => {
    try {
      setJobs(await myJobs());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    load();
    paymentConfig()
      .then((cfg) => setMobileEnabled(cfg.mobileMoneyEnabled))
      .catch(() => setMobileEnabled(false));
  }, [load]);

  async function onConfirm(job: CollectionJob) {
    setConfirming(job.id);
    setError(null);
    setOk(null);
    try {
      await confirmCompletion(job.id);
      setOk(
        job.paymentMethod === "cash"
          ? tx("Umethibitisha. Lipa mkusanyaji taslimu.", "Confirmed. Pay the collector in cash.")
          : tx("Umethibitisha malipo.", "Payment confirmed.")
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setConfirming(null);
    }
  }

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
        latitude: coords?.lat,
        longitude: coords?.lng,
        paymentMethod,
      });
      setOk(tx("Ombi limetumwa. Tunatafuta mkusanyaji.", "Request sent. We are finding a collector."));
      setPickupAddress("");
      setPreferredTime("");
      setCoords(null);
      setPaymentMethod("cash");
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
            <input className="input" value={pickupAddress} onChange={(e) => { setPickupAddress(e.target.value); setCoords(null); }} placeholder={tx("Mtaa, nyumba, alama", "Street, house, landmark")} required />
            <button type="button" className="btn btn-outline btn-sm location-btn" onClick={useMyLocation} disabled={locating}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              {locating ? tx("Inatafuta eneo…", "Finding location…") : tx("Tumia eneo langu", "Use my current location")}
            </button>
            {coords ? (
              <span className="field-hint">
                {tx("Eneo limewekwa", "Location set")}: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </span>
            ) : null}
          </Field>
          <Field label={tx("Njia ya malipo", "Payment method")}>
            <div className="pay-options">
              <button
                type="button"
                className={paymentMethod === "cash" ? "pay-option active" : "pay-option"}
                onClick={() => setPaymentMethod("cash")}
              >
                <span className="pay-option-title">{tx("Taslimu", "Cash")}</span>
                <span className="pay-option-sub">{tx("Lipa wakati wa kuchukua", "Pay on collection")}</span>
              </button>
              <button
                type="button"
                className={paymentMethod === "mobile" ? "pay-option active" : "pay-option"}
                onClick={chooseMobile}
                aria-disabled={!mobileEnabled}
              >
                <span className="pay-option-title">{tx("Simu (M-Pesa n.k.)", "Mobile money")}</span>
                <span className="pay-option-sub">
                  {mobileEnabled
                    ? tx("Lipa kwa simu", "Pay by phone")
                    : tx("Haipatikani bado", "Not available yet")}
                </span>
              </button>
            </div>
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
                <div className="row-meta">
                  {job.paymentMethod === "cash" ? tx("Taslimu", "Cash") : tx("Simu", "Mobile money")}
                  {job.status === "completed"
                    ? ` · ${tx("Imelipwa", "Paid")}`
                    : ""}
                </div>
              </div>
              <div className="row-actions">
                <StatusBadge status={job.status} />
                {job.status === "collected" ? (
                  <button
                    className="btn btn-green btn-sm"
                    disabled={confirming === job.id}
                    onClick={() => onConfirm(job)}
                  >
                    {confirming === job.id
                      ? tx("Inathibitisha…", "Confirming…")
                      : tx("Thibitisha na lipa", "Confirm & pay")}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={mobilePopup}
        onClose={() => setMobilePopup(false)}
        title={tx("Malipo ya simu hayapatikani", "Mobile money unavailable")}
        body={tx(
          "Malipo kwa simu hayapatikani kwa sasa. Tafadhali tumia taslimu.",
          "Mobile money payments are not available right now. Please use cash."
        )}
      >
        <button className="btn btn-blue btn-sm" onClick={() => setMobilePopup(false)}>
          {tx("Sawa, tumia taslimu", "OK, use cash")}
        </button>
      </Modal>
    </div>
  );
}
