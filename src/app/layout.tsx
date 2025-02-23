import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VegieHat",
  description: "Empowering Communities for Fairer Markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f7f7f7]`}
      >
        <div className="max-w-[1075px] bg-white mx-auto my-10 shadow-lg shadow-gray-500 rounded-lg">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
