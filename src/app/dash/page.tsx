// src/app/dash/page.tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Layout from "@/components/dash/Layout";
import DashboardHome from "@/components/dash/Dashboard";

export default function DashPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/");
      else setAuthReady(true);
    });
    return () => unsub();
  }, [router]);

  if (!authReady) return null;

  return (
    <Layout>
      <DashboardHome />
    </Layout>
  );
}
