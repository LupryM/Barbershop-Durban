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
    <footer className="bg-accent text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight font-montserrat">
              XCLUSIVE BARBER
            </h3>
            <p className="text-sm text-white/90 leading-6 max-w-xs font-poppins">
              Gentlemen Groomers - The Barber Cartel. Durban's premier barbershop delivering exceptional grooming
              experiences through precision, style, and unmatched expertise.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white font-montserrat">
              Service
            </h4>
            <ul className="space-y-2 text-sm text-white/90 font-poppins leading-6">
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

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white font-montserrat">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/90 font-poppins leading-6">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  121 Helen Joseph Rd, Bulwer<br />
                  Durban, Davenport
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+27 67 886 4334</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>ebarbershop988@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white font-montserrat">
              Hours
            </h4>
            <ul className="space-y-2 text-sm text-white/90 font-poppins leading-6">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>09:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 - 17:00</span>
              </li>
              <li className="flex justify-between text-white/60">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70 font-poppins">
          <p>
            © 2025 Xclusive Barber - Durban, South Africa. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
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
