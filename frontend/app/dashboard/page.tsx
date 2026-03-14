"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomerDashboard } from "@/components/customer-dashboard";
import { AdminDashboard } from "@/components/admin-dashboard";
import { BarberDashboard } from "@/components/barber-dashboard";
import { Toaster } from "sonner";
import { useAuth } from "@/context/auth-context";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn, isLoading } = useAuth();
  const tabParam = searchParams.get('tab') as 'appointments' | 'profile' | null;

  useEffect(() => {
    // Wait for auth hydration before deciding to redirect
    if (!isLoading && !isLoggedIn) {
      router.push("/login?returnTo=/dashboard");
    }
  }, [isLoading, isLoggedIn, router]);

  // Show nothing while hydrating (avoids flash)
  if (isLoading || !user) return null;

  // Toaster lives here for dashboard-level toasts
  const content = (() => {
    if (user.role === "admin")  return <AdminDashboard  user={user} />;
    if (user.role === "barber") return <BarberDashboard user={user} />;
    return <CustomerDashboard user={user} initialTab={tabParam} />;
  })();

  return (
    <>
      <Toaster position="top-center" expand={true} richColors />
      {content}
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
