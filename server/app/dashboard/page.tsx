"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardIndex() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.role === "collector") router.replace("/dashboard/collector");
    else if (user.role === "recycler" || user.role === "admin")
      router.replace("/dashboard/market");
    else router.replace("/dashboard/generator");
  }, [user, router]);

  return null;
}
