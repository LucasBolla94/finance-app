"use client";

import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

/** 🔧 Toggle de cadastro — defina como false para desativar register */
const REGISTRATION_ENABLED = true;

export default function AuthWrapper() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [flash, setFlash] = useState(""); // mensagem de sucesso

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  /* callback disparado pelo RegisterForm */
  const handleRegistered = () => {
    setFlash("Account created! Please log in.");
    setMode("login");
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg transition hover:scale-[1.01] sm:p-10">
      <h1 className="mb-2 text-center text-3xl font-semibold text-gray-800">
        {mode === "login" ? "Welcome back" : "Create account"}
      </h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        {mode === "login" ? "Sign in to continue" : "Start your journey with us"}
      </p>

      {flash && (
        <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700">
          {flash}
        </div>
      )}

      {mode === "login" ? (
        <LoginForm />
      ) : (
        <RegisterForm onRegistered={handleRegistered} />
      )}

      {/* link rodapé ------------------------------------------------ */}
      {REGISTRATION_ENABLED && (
        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? "No account yet?" : "Already registered?"}{" "}
          <button
            type="button"
            onClick={() =>
              setMode((prev) => (prev === "login" ? "register" : "login"))
            }
            className="font-medium text-blue-700 hover:underline"
          >
            {mode === "login" ? "Create one" : "Login"}
          </button>
        </p>
      )}
    </div>
  );
}
