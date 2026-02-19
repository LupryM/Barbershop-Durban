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
      <header className="bg-black text-white py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <Link href="/" className="hover:text-neutral-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold font-montserrat">Book Your Appointment</h1>
        </div>
      </header>

      {/* Booking System Only */}
      <BookingSystem hideTitle={true} />
    </div>
  );
}
