"use client";

import { useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

/** 🔒 Bloqueia rota se não houver usuário */
export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = carregando

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) router.replace("/"); // volta para login
    });
  }, [router]);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <span className="animate-pulse text-sm text-blue-600">Loading…</span>
      </div>
    );
  }

  if (!user) return null; // já redirecionou

  return <>{children}</>;
}
