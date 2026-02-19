"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingSystem } from "@/components/booking-system";
import { Toaster } from "sonner";
import "react-day-picker/dist/style.css";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" expand={true} richColors />
      
      {/* Header */}
      <header className="bg-black py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Xclusive Barber Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl md:text-2xl font-semibold tracking-tight text-white font-montserrat">
              XCLUSIVE BARBER
            </span>
          </Link>
          <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors font-semibold font-montserrat flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </header>

      {/* Booking System Only */}
      <BookingSystem hideTitle={true} />
    </div>
  );
}
