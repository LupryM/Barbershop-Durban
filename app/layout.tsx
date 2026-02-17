import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XCLUSIVE BARBER - Davenport, Durban | All Types of XCLUSIVE Haircuts",
  description:
    "XCLUSIVE BARBER in Davenport, Durban. All types of XCLUSIVE haircuts, hair colouring, bald cuts (chiskop), beard services, and hectic designs. Book now at 121 Helen Joseph Rd, Bulwer.",
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
