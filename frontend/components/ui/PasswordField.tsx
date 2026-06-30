"use client";

import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  showLabel: string;
  hideLabel: string;
}

/** A password input with a button to toggle visibility. */
export function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  showLabel,
  hideLabel,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-wrap">
      <input
        className="input"
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
        title={visible ? hideLabel : showLabel}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path
              d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.1A9.5 9.5 0 0112 5c5 0 9 4 10 7a12.4 12.4 0 01-2.9 4M6.1 6.1A12.5 12.5 0 002 12c1 3 5 7 10 7a9.6 9.6 0 004-0.9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path
              d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </button>
    </div>
  );
}
