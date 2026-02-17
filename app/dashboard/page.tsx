"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerDashboard } from "@/components/customer-dashboard";
import { AdminDashboard } from "@/components/admin-dashboard";
import { BarberDashboard } from "@/components/barber-dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("xclusiveUser");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) return null;

  if (user.role === "admin") {
    return <AdminDashboard user={user} />;
  }
  if (user.role === "barber") {
    return <BarberDashboard user={user} />;
  }
  return <CustomerDashboard user={user} />;
}
