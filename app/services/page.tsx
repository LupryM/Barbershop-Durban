"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Scissors, Paintbrush, CircleDot, Smile, Sparkles } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Normal Haircut",
    description: "XCLUSIVE haircut",
    price: "R100",
    duration: "30 min",
    icon: Scissors,
  },
  {
    id: 2,
    name: "Haircut with Dye",
    description: "XCLUSIVE haircut with dye",
    price: "R150",
    duration: "45 min",
    icon: Scissors,
  },
  {
    id: 3,
    name: "Full House",
    description: "With dye and fibre",
    price: "R180",
    duration: "60 min",
    icon: Scissors,
  },
  {
    id: 4,
    name: "Clipper Chiskop",
    description: "XCLUSIVE bald cut",
    price: "R60",
    duration: "20 min",
    icon: CircleDot,
  },
  {
    id: 5,
    name: "Razor Blade Chiskop",
    description: "XCLUSIVE bald cut",
    price: "R70",
    duration: "30 min",
    icon: CircleDot,
  },
  {
    id: 6,
    name: "Hair Colouring - Black",
    description: "XCLUSIVE hair colouring",
    price: "R100",
    duration: "45 min",
    icon: Paintbrush,
  },
  {
    id: 7,
    name: "Hair Colouring - Blond",
    description: "XCLUSIVE hair colouring",
    price: "R100",
    duration: "45 min",
    icon: Paintbrush,
  },
  {
    id: 8,
    name: "Hair Colouring - White",
    description: "XCLUSIVE hair colouring",
    price: "R200",
    duration: "60 min",
    icon: Paintbrush,
  },
  {
    id: 9,
    name: "Beard Shave",
    description: "XCLUSIVE beard service",
    price: "R20",
    duration: "15 min",
    icon: Smile,
  },
  {
    id: 10,
    name: "Beard with Dye",
    description: "XCLUSIVE beard service",
    price: "R50",
    duration: "30 min",
    icon: Smile,
  },
  {
    id: 11,
    name: "Straight Line Design",
    description: "XCLUSIVE design",
    price: "R20",
    duration: "10 min",
    icon: Sparkles,
  },
  {
    id: 12,
    name: "Hectic Design",
    description: "Any hectic design",
    price: "R100",
    duration: "30 min",
    icon: Sparkles,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <Link href="/" className="hover:text-neutral-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold font-montserrat">Services & Pricing</h1>
        </div>
      </header>

      {/* Services List */}
      <main className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 font-montserrat text-black">
              All types of XCLUSIVE <br />cuts and styles.
            </h2>
            <p className="text-black/60 font-open-sans">
              Browse our complete range of services and their prices
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="border-2 border-black/10 rounded-lg p-6 hover:border-accent transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 flex items-center justify-center border-2 border-black/10 rounded-full group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
                    <service.icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-black font-montserrat">
                      {service.price}
                    </p>
                    <p className="text-sm text-black/50 font-poppins">
                      {service.duration}
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black font-montserrat">
                  {service.name}
                </h3>
                <p className="text-sm text-black/60 font-open-sans">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/#book"
              className="inline-block px-10 py-4 bg-accent text-white font-bold rounded-full hover:opacity-90 transition-all font-poppins"
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
