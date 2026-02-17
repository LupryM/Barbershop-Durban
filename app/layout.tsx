import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xclusive Barber - Premium Barbershop in Durban, South Africa",
  description:
    "Experience excellence at Xclusive Barber in Durban. Premium haircuts, expert beard grooming, and traditional shaves. Book your appointment today.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo2 (2).png",
      },
      {
        url: "/favicon.ico",
      },
    ],
    apple: "/logo2 (2).png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
