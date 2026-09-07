import type { Metadata } from "next";
import { Montserrat, Poppins, Open_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const siteUrl = "https://xclusivebarber.co.za";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Xclusive Barber | Barbershop in Davenport, Durban",
    template: "%s | Xclusive Barber Durban",
  },
  description:
    "Xclusive Barber in Davenport, Durban. Haircuts, hair colouring, bald cuts (chiskop), beard trims & hectic designs. Walk-ins welcome or book online. 121 Helen Joseph Rd, Bulwer.",
  keywords: [
    "barber Durban",
    "barbershop Durban",
    "Xclusive Barber",
    "haircut Durban",
    "Davenport barber",
    "Bulwer barbershop",
    "chiskop Durban",
    "beard trim Durban",
    "hair colouring Durban",
    "fade haircut Durban",
    "book barber Durban",
  ],
  authors: [{ name: "Xclusive Barber", url: siteUrl }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "Xclusive Barber",
    title: "Xclusive Barber | Barbershop in Davenport, Durban",
    description:
      "Haircuts, fades, chiskop, beard trims & hectic designs. Book your appointment online or walk in. Located at 121 Helen Joseph Rd, Bulwer, Durban.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Xclusive Barber logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Xclusive Barber | Barbershop in Davenport, Durban",
    description:
      "Haircuts, fades, chiskop, beard trims & hectic designs. Book online or walk in — 121 Helen Joseph Rd, Bulwer, Durban.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Xclusive Barber",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/logo.png`,
  description:
    "Barbershop in Davenport, Durban offering haircuts, fades, chiskop, beard trims, hair colouring, and hectic designs.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "121 Helen Joseph Rd",
    addressLocality: "Bulwer",
    addressRegion: "Durban",
    addressCountry: "ZA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -29.8701,
    longitude: 30.9785,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "09:00",
      closes: "15:00",
    },
  ],
  email: "info@xclusivebarber.co.za",
  priceRange: "R",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.variable} ${poppins.variable} ${openSans.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <a
            href="https://wa.me/27611810056"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
            aria-label="Chat with us on WhatsApp"
          >
            <i className="fa-brands fa-whatsapp text-3xl"></i>
          </a>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}

