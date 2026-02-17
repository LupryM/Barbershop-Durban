import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="space-y-6">
            <h3 className="text-2xl font-light tracking-tighter">XCLUSIVE BARBER</h3>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Durban's premier barbershop delivering exceptional grooming experiences through precision, style, and unmatched expertise.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest text-white/40 font-medium">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#location" className="hover:text-white transition-colors">Location</a></li>
              <li><a href="#book" className="hover:text-white transition-colors">Book Online</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">My Bookings</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest text-white/40 font-medium">Contact</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Durban, <br />KwaZulu-Natal, South Africa</span>
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
            <h4 className="text-xs uppercase tracking-widest text-white/40 font-medium">Hours</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>09:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 - 17:00</span>
              </li>
              <li className="flex justify-between text-white/30">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/20">
          <p>© 2025 Xclusive Barber - Durban, South Africa. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white/40">Privacy Policy</a>
            <a href="#" className="hover:text-white/40">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1630435664010-20cbd1d7bb6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFycCUyMG1lbiUyMGhhaXJjdXQlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc3MTI3MjkxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1764670687832-6dc25615fdf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjB0b29scyUyMGRhcmslMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzcxMjcyOTE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1610475680335-dafab5475150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXJiZXJzaG9wJTIwaW50ZXJpb3IlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc3MTI3MjkxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1747832512459-5566e6d0ee5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBiYXJiZXIlMjBhdCUyMHdvcmt8ZW58MXx8fHwxNzcxMjcyOTE3fDA&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  return (
    <section className="py-2 bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((src, idx) => (
          <div key={idx} className="aspect-square overflow-hidden group">
            <img 
              src={src} 
              alt={`Gallery ${idx}`} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700 cursor-pointer" 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
