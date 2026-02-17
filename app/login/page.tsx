"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, ShieldCheck } from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = { name: name.trim(), role };
      localStorage.setItem("xclusiveUser", JSON.stringify(user));
      toast.success("Welcome to XCLUSIVE BARBER!");
      router.push("/dashboard");
      router.refresh();
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" expand={true} richColors />

      {/* Nav */}
      <nav className="px-6 py-6 border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Xclusive Barber Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-light tracking-tighter text-black">
              XCLUSIVE BARBER
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <span className="text-black/40 uppercase tracking-widest text-xs mb-4 block">
              Sign In
            </span>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black mb-4">
              Welcome Back
            </h1>
            <p className="text-black/50 text-sm leading-relaxed">
              Sign in to manage your appointments and bookings
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-xs uppercase tracking-widest text-black/40 font-medium"
                >
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-4 py-4 border-2 border-black/10 text-black placeholder:text-black/20 focus:border-accent focus:outline-none transition-all bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="block text-xs uppercase tracking-widest text-black/40 font-medium"
                >
                  Role
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-black/10 text-black focus:border-accent focus:outline-none transition-all bg-white appearance-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="barber">Barber</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground py-4 font-medium text-sm uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-black/30">
              Need help? Call{" "}
              <a href="tel:+27678864334" className="text-black/50 hover:text-black transition-colors">
                +27 67 886 4334
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
