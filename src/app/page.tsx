// src/app/page.tsx
import AuthWrapper from "@/components/home/AuthWrapper";

export const metadata = {
  title: "Sign in • MyAuthApp",
  description: "Secure login for MyAuthApp",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <AuthWrapper />
    </main>
  );
}
