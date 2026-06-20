import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth">
      <div className="auth-top">
        <Link className="mark" href="/" aria-label="Mali">
          <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="1.5" y="1.5" width="37" height="37" rx="9" fill="#0D47A1" />
            <path d="M6 27 L24 9" stroke="#C0CA33" strokeWidth="7" />
            <circle cx="22" cy="22" r="8.5" fill="none" stroke="#fff" strokeWidth="3.4" />
          </svg>
          <span className="word">Mali</span>
        </Link>
        <LanguageToggle />
      </div>
      <main className="auth-main">{children}</main>
    </div>
  );
}
