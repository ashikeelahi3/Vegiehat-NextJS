"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-1 flex items-center justify-start gap-4">
          <img src="/images/web/vegiehat-logo.png" alt="Logo" className="w-20 h-20" />
          <div>
            <span className="text-xl font-bold text-gray-900">VegieHat</span>
            <hr className="my-1" />
            <p className="text-gray-600">Empowering Communities for Fairer Markets</p>
          </div>
        </div> 
      </header>

      <nav className="sticky top-0 z-40 bg-black text-white shadow-md p-2 border-b-[6px] border-orange-400">
        <div className="container mx-auto flex justify-between items-center">
          {/* Hamburger Menu - Now on the left */}
          <button
            className="md:hidden p-1 rounded-md text-white hover:text-orange-300 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/app" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>App</Link>
            <Link href="/teams" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>Team</Link>
            <Link href="/report" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>Report</Link>
            <Link href="/input" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>Input</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white hover:text-orange-300 border border-white/20 rounded-md hover:border-orange-300 transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-black bg-indigo-400 rounded-md hover:bg-orange-300 transition-colors">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-4 mt-4 p-4 bg-black border-t border-white/10">
            <Link href="/" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/app" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>App</Link>
            <Link href="/teams" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>Team</Link>
            <Link href="/report" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>Report</Link>
            <Link href="/input" className="text-white hover:text-orange-300 transition-colors" onClick={() => setIsOpen(false)}>Input</Link>
          </div>
        )}
      </nav>
    </>
  );
}
