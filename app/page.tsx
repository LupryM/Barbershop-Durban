"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Menu, X } from "lucide-react";
import { Hero } from "@/components/hero";
import { WelcomeTitle, Description } from "@/components/welcome";
import { Services } from "@/components/services";
import { Gallery, Footer } from "@/components/gallery-and-footer";
import { LocationMap } from "@/components/location-map";

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
            ? "bg-black/95 backdrop-blur-md py-3 shadow-lg"
            : "bg-black py-4"
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
              className="text-xl md:text-2xl font-semibold tracking-tight transition-colors text-white font-montserrat"
            >
              XCLUSIVE BARBER
            </span>
          </a>

          {/* Desktop Nav */}
          <div
            className="hidden md:flex items-center gap-8 text-[17px] font-semibold transition-colors text-white font-montserrat"
          >
            <a href="/" className="hover:text-neutral-400 transition-colors">
              Home
            </a>
            <a href="#services" className="hover:text-neutral-400 transition-colors">
              Services
            </a>
            <a href="#location" className="hover:text-neutral-400 transition-colors">
              Location
            </a>
            <a href="/dashboard" className="hover:text-neutral-400 transition-colors">
              My Bookings
            </a>
            <a
              href="/services"
              className="px-5 py-4 bg-accent text-accent-foreground hover:opacity-90 transition-all font-bold tracking-wide rounded-full font-poppins"
            >
              BOOK NOW
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Full-Screen Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-[100] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-accent z-[101] md:hidden animate-in slide-in-from-right duration-300 shadow-2xl">
              <button
                className="absolute top-6 right-6 text-white p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="pt-20 px-8 flex flex-col gap-8 text-lg font-semibold text-white font-montserrat">
                <a
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-neutral-300 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-neutral-300 transition-colors"
                >
                  Services
                </a>
                <a
                  href="#location"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-neutral-300 transition-colors"
                >
                  Location
                </a>
                <a
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-neutral-300 transition-colors"
                >
                  Login / Sign Up
                </a>
                <a
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-neutral-300 transition-colors"
                >
                  My Bookings
                </a>
                <a
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white font-bold mt-4"
                >
                  Book Appointment
                </a>
              </div>
            </div>
          </>
        )}
      </nav>

      <main>
        <Hero />
        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
            <WelcomeTitle />
            <Description />
          </div>
        </section>
        <Gallery />
        <Services />
        <LocationMap />
      </main>

      <Footer />
    </div>
  );
}
