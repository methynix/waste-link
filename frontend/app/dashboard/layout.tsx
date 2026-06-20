"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTx } from "@/hooks/useTx";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const tx = useTx();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return <div className="dash-loading">{tx("Inapakia…", "Loading…")}</div>;
  }
  if (!user) return null;

  return (
    <div className="dash">
      <DashboardNav />
      <main className="dash-main">{children}</main>
    </div>
  );
}
