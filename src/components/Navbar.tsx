"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header>
        <div className="flex items-center justify-between">
          <img src="./images/web/vegiehat-logo.png" alt="Logo" className="w-32 h-32" />
          <span className="text-xl font-bold ml-2">Vegiehat</span>
        </div> 
      </header>
        <nav className="bg-black text-white shadow-md p-4 border-b-[6px] border-orange-400">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">Brand</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/app" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>App</Link>
            <Link href="/teams" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Team</Link>
            <Link href="/report" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Report</Link>
            <Link href="/input" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Input</Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden flex flex-col space-y-4 mt-2 p-4 bg-black shadow-md">
            <Link href="/" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/app" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>App</Link>
            <Link href="/teams" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Team</Link>
            <Link href="/report" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Report</Link>
            <Link href="/input" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Input</Link>
          </div>
        )}
      </nav>
    </>
  );
}
