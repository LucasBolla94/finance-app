"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/* props ------------------------------------------------ */
interface RegisterProps {
  onRegistered: () => void; // callback do wrapper
}

/* icons ------------------------------------------------ */
const MailIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 5h18v14H3z" />
    <path d="m3 5 9 7 9-7" />
  </svg>
);
const LockIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const UserIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4" />
    <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
  </svg>
);

export default function RegisterForm({ onRegistered }: RegisterProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        firstName,
        lastName,
        email,
        createdAt: serverTimestamp(),
      });
      onRegistered(); // ✅ mensagem + volta p/ login
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        {/* FIRST NAME */}
        <label className="relative block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <UserIcon />
          </span>
          <input
            type="text"
            placeholder="First name"
            className="peer w-full rounded-lg border border-gray-300 bg-white/80 py-2 pl-11 pr-3 text-sm placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>

        {/* LAST NAME */}
        <label className="relative block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <UserIcon />
          </span>
          <input
            type="text"
            placeholder="Last name"
            className="peer w-full rounded-lg border border-gray-300 bg-white/80 py-2 pl-11 pr-3 text-sm placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        {/* EMAIL */}
        <label className="relative block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MailIcon />
          </span>
          <input
            type="email"
            placeholder="Email address"
            className="peer w-full rounded-lg border border-gray-300 bg-white/80 py-2 pl-11 pr-3 text-sm placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {/* PASSWORD */}
        <label className="relative block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockIcon />
          </span>
          <input
            type="password"
            placeholder="Password"
            className="peer w-full rounded-lg border border-gray-300 bg-white/80 py-2 pl-11 pr-3 text-sm placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Create account"}
        </button>
      </form>
    </>
  );
}
