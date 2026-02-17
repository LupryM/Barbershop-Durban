"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = { name: name || "Guest", role };
      localStorage.setItem("xclusiveUser", JSON.stringify(user));
      toast.success("Welcome to Xclusive Barber!");
      router.push("/dashboard");
      router.refresh();
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-white">
      {/* Background with overlay to match Hero theme */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Barbershop Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo2 (2).png"
              alt="Xclusive Barber"
              width={40}
              height={40}
              className="rounded-sm"
            />
            <span className="text-lg font-light tracking-tighter text-black">
              XCLUSIVE BARBER
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 p-8 md:p-12 rounded-xl shadow-2xl ring-1 ring-black/5">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-3">
              Welcome Back
            </h1>
            <p className="text-black/50 text-sm">
              Sign in with your phone number to manage appointments
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-widest text-black/50 font-medium"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3.5 bg-black/[0.03] border border-black/10 rounded-lg text-black placeholder:text-black/20 focus:border-black/30 focus:outline-none focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="block text-xs uppercase tracking-widest text-black/50 font-medium"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3.5 bg-black/[0.03] border border-black/10 rounded-lg text-black focus:border-black/30 focus:outline-none focus:bg-white transition-all"
              >
                <option value="customer">Customer</option>
                <option value="barber">Barber</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground py-3.5 rounded-lg font-medium text-sm uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/20">
            Need help? Call +27 (0) 82 123 4567
          </p>
        </div>
      </div>
    </div>
  );
}
