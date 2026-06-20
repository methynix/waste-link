"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LanguageToggle from "@/components/LanguageToggle";
import { useAuth } from "@/hooks/useAuth";
import { useTx } from "@/hooks/useTx";
import type { Role } from "@/types";

type NavItem = { href: string; sw: string; en: string };

const LINKS: Record<Role, NavItem[]> = {
  waste_generator: [
    { href: "/dashboard/generator", sw: "Omba kuchukuliwa", en: "Request pickup" },
    { href: "/dashboard/market", sw: "Soko", en: "Market" },
    { href: "/dashboard/wallet", sw: "Pochi", en: "Wallet" },
  ],
  collector: [
    { href: "/dashboard/collector", sw: "Kazi", en: "Jobs" },
    { href: "/dashboard/wallet", sw: "Pochi", en: "Wallet" },
  ],
  recycler: [
    { href: "/dashboard/market", sw: "Soko", en: "Market" },
    { href: "/dashboard/wallet", sw: "Pochi", en: "Wallet" },
  ],
  admin: [
    { href: "/dashboard/market", sw: "Soko", en: "Market" },
    { href: "/dashboard/wallet", sw: "Pochi", en: "Wallet" },
  ],
};

export default function DashboardNav() {
  const { user, signOut } = useAuth();
  const tx = useTx();
  const router = useRouter();
  const pathname = usePathname();
  const items = user ? LINKS[user.role] : [];

  const onSignOut = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <header className="dash-nav">
      <div className="dash-nav-inner">
        <Link className="mark" href="/dashboard" aria-label="Mali">
          <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="1.5" y="1.5" width="37" height="37" rx="9" fill="#0D47A1" />
            <path d="M6 27 L24 9" stroke="#C0CA33" strokeWidth="7" />
            <circle cx="22" cy="22" r="8.5" fill="none" stroke="#fff" strokeWidth="3.4" />
          </svg>
          <span className="word">Mali</span>
        </Link>
        <nav className="dash-links">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={pathname === it.href ? "dash-link active" : "dash-link"}
            >
              {tx(it.sw, it.en)}
            </Link>
          ))}
        </nav>
        <div className="dash-nav-right">
          <LanguageToggle />
          <button className="btn btn-ghost btn-sm" onClick={onSignOut}>
            {tx("Toka", "Sign out")}
          </button>
        </div>
      </div>
    </header>
  );
}
