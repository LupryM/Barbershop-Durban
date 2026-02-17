import React from "react";
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-50 text-black pt-24 pb-12 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="space-y-6">
            <h3 className="text-2xl font-light tracking-tighter">
              XCLUSIVE BARBER
            </h3>
            <p className="text-sm text-black/50 leading-relaxed max-w-xs">
              Durban's premier barbershop delivering exceptional grooming
              experiences through precision, style, and unmatched expertise.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest text-black/40 font-medium">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm text-black/60">
              <li>
                <a href="/" className="hover:text-black transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-black transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#location"
                  className="hover:text-black transition-colors"
                >
                  Location
                </a>
              </li>
              <li>
                <a href="#book" className="hover:text-black transition-colors">
                  Book Online
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-black transition-colors">
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-black transition-colors"
                >
                  My Bookings
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest text-black/40 font-medium">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-black/60">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Durban, <br />
                  KwaZulu-Natal, South Africa
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+27 (0) 82 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@xclusivebarber.co.za</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest text-black/40 font-medium">
              Hours
            </h4>
            <ul className="space-y-4 text-sm text-black/60">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>09:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 - 17:00</span>
              </li>
              <li className="flex justify-between text-black/30">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-black/30">
          <p>
            © 2025 Xclusive Barber - Durban, South Africa. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black/60">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black/60">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Gallery() {
  const images = [
    "/haircuts/braids.webp",
    "/haircuts/fade.webp",
    "/haircuts/kid.webp",
    "/haircuts/rashford.webp",
  ];

  return (
    <section className="py-2 bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((src, idx) => (
          <div key={idx} className="aspect-square overflow-hidden group">
            <img
              src={src}
              alt={`Gallery ${idx}`}
              className="w-full h-full object-cover hover:scale-105 transition-all duration-700 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
