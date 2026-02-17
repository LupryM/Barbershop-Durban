import React from "react";
import { Scissors, Zap, Shield, Sparkles } from "lucide-react";

const serviceCategories = [
  {
    icon: Scissors,
    title: "XCLUSIVE Haircut",
    description:
      "Normal haircut (R100), Haircut with dye (R150), Full house with dye and fibre (R180)",
    price: "From R100",
  },
  {
    icon: Sparkles,
    title: "Hair Colouring",
    description: "Black (R100), Blond (R100), White (R200)",
    price: "From R100",
  },
  {
    icon: Shield,
    title: "XCLUSIVE Bald Cut",
    description:
      "Clipper chiskop (R60), Razor blade chiskop (R70)",
    price: "From R60",
  },
  {
    icon: Zap,
    title: "XCLUSIVE Beard",
    description:
      "Beard shave (R20), Beard with dye (R50)",
    price: "From R20",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="py-24 bg-white text-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div>
              <span className="text-black/40 uppercase tracking-widest text-xs mb-4 block">
                XCLUSIVE Services
              </span>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
                All types of XCLUSIVE <br />
                cuts and styles.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
              {serviceCategories.map((service, index) => (
                <div key={index} className="space-y-4 group">
                  <div className="w-12 h-12 flex items-center justify-center border-2 border-black/10 rounded-full group-hover:bg-accent group-hover:border-accent group-hover:text-accent-foreground transition-all duration-300">
                    <service.icon className="w-5 h-5 text-black/60 group-hover:text-accent-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-light group-hover:text-accent transition-colors duration-300">{service.title}</h3>
                    <p className="text-sm text-black/50 leading-relaxed">
                      {service.description}
                    </p>
                    <p className="text-sm font-medium pt-2 text-accent">{service.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1747832512459-5566e6d0ee5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBiYXJiZXIlMjBhdCUyMHdvcmt8ZW58MXx8fHwxNzcxMjcyOTE3fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Professional Barber"
              className="w-full h-full object-cover scale-110 grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10">
              <p className="text-white italic font-serif text-xl drop-shadow-md">
                "XCLUSIVE PROMO: Cut 3 Haircuts get 1 FREE"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
