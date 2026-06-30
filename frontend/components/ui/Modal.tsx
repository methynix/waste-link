"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  body?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, body, children }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        {body ? <p className="modal-body">{body}</p> : null}
        <div className="modal-actions">{children}</div>
      </div>
    </div>
  );
}
