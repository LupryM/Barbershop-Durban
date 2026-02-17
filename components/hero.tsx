import React from "react";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#121212]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Xclusive Barber"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#121212]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 tracking-tight leading-[0.95] text-balance">
          Where Style Meets Excellence
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed text-pretty">
          Durban's premier destination for precision cuts, expert beard
          grooming, and timeless style. Experience the art of barbering
          redefined.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#book"
            className="px-10 py-4 bg-white text-black text-sm uppercase tracking-widest font-medium hover:bg-white/90 transition-all rounded-sm"
          >
            Book Appointment
          </a>
          <a
            href="#services"
            className="px-10 py-4 border border-white/30 text-white text-sm uppercase tracking-widest font-medium hover:bg-white hover:text-black transition-all rounded-sm"
          >
            Our Services
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/40" />
      </div>
    </section>
  );
}
