"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { SignInButton } from './auth/SignInButton';
import { SignUpButton } from './auth/SignUpButton';
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Only show theme toggle after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-6 flex items-center justify-start gap-4">
          <div className="flex items-center">
            <img src="/images/web/vegiehat-logo.png" alt="Logo" className={`transition-all duration-300 ${scrolled ? 'w-12 h-12' : 'w-16 h-16'}`} />
          </div>
          <div>
            <span className={`font-bold text-vegiehat-primary dark:text-vegiehat-accent transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl'}`}>VegieHat</span>
            <hr className="my-1 w-3/4 border-vegiehat-accent/30 dark:border-vegiehat-secondary/50" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Empowering Communities for Fairer Markets</p>
          </div>
        </div> 
      </header>

      <nav className={`sticky top-0 z-50 bg-gradient-to-r from-vegiehat-primary to-vegiehat-secondary dark:from-vegiehat-dark dark:to-vegiehat-primary shadow-md transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}>
        <div className="container mx-auto px-3 md:pl-0  py-0 flex justify-between items-center">
          {/* Hamburger Menu */}
          <button
            className="md:hidden p-2 py-4 rounded-md text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop Navigation Links with Borders */}
          <div className="hidden md:flex space-x-0 items-center">
            <Link href="/" className="text-white text-sm font-medium hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-4 py-4 transition-colors border-l border-r border-white/10" onClick={() => setIsOpen(false)}>Home</Link>
            {/* <Link href="/app" className="text-white text-sm font-medium hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-4 py-4 transition-colors border-r border-white/10" onClick={() => setIsOpen(false)}>App</Link> */}
            <Link href="/input" className="text-white text-sm font-medium hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-4 py-4 transition-colors border-r border-white/10" onClick={() => setIsOpen(false)}>Input</Link>
            <Link href="/teams" className="text-white text-sm font-medium hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-4 py-4 transition-colors border-r border-white/10" onClick={() => setIsOpen(false)}>Team</Link>
            <Link href="/report" className="text-white text-sm font-medium hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-4 py-4 transition-colors border-r border-white/10" onClick={() => setIsOpen(false)}>Report</Link>
          </div>

          {/* Auth Buttons and Theme Toggle */}
          <div className="flex items-center space-x-5">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            
            {mounted && (
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
            )}
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: theme === "dark" ? "bg-gray-800 border border-gray-700" : "",
                    userButtonPopoverActionButton: theme === "dark" ? "text-white hover:bg-gray-700 hover:text-white" : "",
                    userButtonPopoverActionButtonText: theme === "dark" ? "text-white hover:text-white group-hover:text-white" : "",
                    userButtonPopoverActionButtonIcon: theme === "dark" ? "text-gray-400 group-hover:text-white" : "",
                    userButtonPopoverFooter: theme === "dark" ? "border-gray-700" : "",
                    userPreviewMainIdentifier: theme === "dark" ? "text-white" : "",
                    userPreviewSecondaryIdentifier: theme === "dark" ? "text-gray-300" : ""
                  },
                  variables: theme === "dark" 
                    ? {
                        colorPrimary: "#3E885B",
                        colorBackground: "#1F2937",
                        colorText: "#F9FAFB",
                        colorTextSecondary: "#D1D5DB",
                        colorInputBackground: "#111827",
                        colorInputText: "#F9FAFB",
                        colorDanger: "#EF4444",
                        colorSuccess: "#10B981",
                        colorWarning: "#F59E0B"
                      }
                    : {
                        colorPrimary: "#1E5631",
                        colorBackground: "#FFFFFF"
                      }
                }}
              />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col mt-1 bg-vegiehat-dark/95 backdrop-blur-sm dark:bg-gray-900/95 border-t border-white/10">
            <Link href="/" className="text-white hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-6 py-3 transition-colors border-b border-white/10" onClick={() => setIsOpen(false)}>Home</Link>
            {/* <Link href="/app" className="text-white hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-6 py-3 transition-colors border-b border-white/10" onClick={() => setIsOpen(false)}>App</Link> */}
            <Link href="/input" className="text-white hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-6 py-3 transition-colors border-b border-white/10" onClick={() => setIsOpen(false)}>Input</Link>
            <Link href="/teams" className="text-white hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-6 py-3 transition-colors border-b border-white/10" onClick={() => setIsOpen(false)}>Team</Link>
            <Link href="/report" className="text-white hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-6 py-3 transition-colors border-b border-white/10" onClick={() => setIsOpen(false)}>Report</Link>
            
            {/* Theme Toggle in Mobile Menu */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center text-white hover:bg-vegiehat-pepper hover:text-vegiehat-dark px-6 py-3 transition-colors"
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={18} className="mr-3" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} className="mr-3" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
