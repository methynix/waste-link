import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth">
      <div className="auth-top">
        <Link className="mark" href="/" aria-label="Ecothynx">
          <img src="/icons/icon-192.png" alt="" width={34} height={34} className="mark-logo" />
          <span className="word">Ecothynx</span>
        </Link>
        <LanguageToggle />
      </div>
      <main className="auth-main">{children}</main>
    </div>
  );
}
