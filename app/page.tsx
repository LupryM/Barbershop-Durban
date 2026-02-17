"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Menu, X } from "lucide-react";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { BookingSystem } from "@/components/booking-system";
import { Gallery, Footer } from "@/components/gallery-and-footer";
import { LocationMap } from "@/components/location-map";
import "react-day-picker/dist/style.css";

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Toaster position="top-center" expand={true} richColors />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md py-3 border-b border-black/5 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo and Brand */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Xclusive Barber Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className={`text-xl md:text-2xl font-light tracking-tighter transition-colors ${
                isScrolled ? "text-black" : "text-black"
              }`}
            >
              XCLUSIVE BARBER
            </span>
          </a>

          {/* Desktop Nav */}
          <div
            className={`hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${
              isScrolled ? "text-black/60" : "text-black/60"
            }`}
          >
            <a href="/" className="hover:text-black transition-colors">
              Home
            </a>
            <a href="#services" className="hover:text-black transition-colors">
              Services
            </a>
            <a href="#location" className="hover:text-black transition-colors">
              Location
            </a>
            <a href="/login" className="hover:text-black transition-colors">
              Login
            </a>
            <a
              href="#book"
              className="px-6 py-2 bg-accent text-accent-foreground hover:opacity-90 transition-all font-medium"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-black/5 md:hidden animate-in slide-in-from-top duration-300 shadow-xl">
            <div className="p-6 flex flex-col gap-6 text-xs uppercase tracking-widest font-medium text-black/60">
              <a
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black"
              >
                Services
              </a>
              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black"
              >
                Location
              </a>
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black"
              >
                Login
              </a>
              <a
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black"
              >
                My Bookings
              </a>
              <a
                href="#book"
                onClick={() => setMobileMenuOpen(false)}
                className="text-black font-bold"
              >
                Book Appointment
              </a>
            </div>
          </div>
        )}
      </nav>

      <main>
        <Hero />
        <Services />
        <Gallery />
        <BookingSystem />
        <LocationMap />
      </main>

      <Footer />
    </div>
  );
}
