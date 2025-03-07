import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "next-themes";

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
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-gray-50 dark:bg-gray-900`}>
          <ThemeProvider attribute="class">
            <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
              {/* Main Content */}
              <div className="flex-1">
                <Navbar />
                <main className="py-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/20 overflow-hidden">
                    {children}
                  </div>
                </main>
              </div>

              {/* Footer */}
              <footer className="bg-gray-900 dark:bg-gray-950 mt-auto rounded-b-lg">
                <div className="py-4 px-6">
                  <p className="text-center text-sm text-gray-300 dark:text-gray-400">
                    © {new Date().getFullYear()} VegieHat. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
            <Toaster position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}