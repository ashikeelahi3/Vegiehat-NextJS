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
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-full bg-vegiehat-light dark:bg-gray-900`}>
          <ThemeProvider attribute="class">
            <div className="min-h-screen max-w-7xl mx-auto sm:px-0 md:px-4 lg:px-8 flex flex-col">
              {/* Main Content */}
              <div className="flex-1">
                <Navbar />
                <main className="py-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-medium ring-1 ring-gray-900/5 dark:ring-gray-700/20 overflow-hidden">
                    {children}
                  </div>
                </main>
              </div>

              {/* Footer */}
              <footer className="bg-vegiehat-primary dark:bg-gray-950 mt-auto rounded-b-lg">
                <div className="py-5 px-6">
                  <p className="text-center text-sm text-white/90 dark:text-gray-400">
                    © {new Date().getFullYear()} VegieHat. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
            <Toaster 
              position="top-right" 
              toastOptions={{
                style: {
                  background: '#F8FAF9',
                  color: '#1E5631',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  borderRadius: '8px',
                },
                success: {
                  style: {
                    background: '#F0FDF4',
                    border: '1px solid #DCFCE7',
                  },
                  iconTheme: {
                    primary: '#16A34A',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  style: {
                    background: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    color: '#991B1B',
                  },
                  iconTheme: {
                    primary: '#DC2626',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}