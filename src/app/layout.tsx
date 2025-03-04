import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
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
          <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
            {/* Main Content */}
            <div className="flex-1">
              <Navbar />
              <main className="py-6">
                <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
                  {children}
                </div>
              </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 mt-auto">
              <div className="py-4 px-6">
                <p className="text-center text-sm text-gray-300">
                  © {new Date().getFullYear()} VegieHat. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              className: "!bg-white !text-gray-900 !shadow-lg",
              success: {
                className: "!bg-emerald-50 !text-emerald-900 !ring-1 !ring-emerald-900/10",
                iconTheme: {
                  primary: '#059669',
                  secondary: '#fff',
                }
              },
              error: {
                className: "!bg-red-50 !text-red-900 !ring-1 !ring-red-900/10",
                iconTheme: {
                  primary: '#DC2626',
                  secondary: '#fff',
                }
              },
              style: {
                padding: '16px',
                borderRadius: '0.5rem',
              }
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}