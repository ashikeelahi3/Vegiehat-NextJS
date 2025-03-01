import type { Metadata } from "next";
import {
  ClerkProvider
} from '@clerk/nextjs'
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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-gray-50`}>
          <div className="min-h-screen max-w-[1070px] mx-auto flex flex-col">
            {/* Main Content */}
            <div className="flex-1">
              <Navbar />
              <main className="">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {children}
                </div>
              </main>
            </div>

            {/* Footer */}
            <footer className="bg-black border-t border-gray-500 mt-auto">
              <div className="py-3">
                <p className="text-center text-sm text-white">
                  © {new Date().getFullYear()} VegieHat. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}