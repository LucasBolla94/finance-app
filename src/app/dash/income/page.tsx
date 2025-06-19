"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Layout from "@/components/dash/Layout";
import AddIncomeForm from "@/components/dash/AddIncomeForm";

export default function IncomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/");
      else setReady(true);
    });
    return () => unsub();
  }, [router]);

  if (!ready) return null;

  return (
    <Layout>
      <AddIncomeForm />
    </Layout>
  );
}
