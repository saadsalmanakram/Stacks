"use client";

import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-purple-600 to-blue-500 p-6 shadow-lg fixed top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-[var(--font-geist-sans)]">Universal Calendar</h1>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-white hover:text-pink-200 transition-colors duration-300">
            Github
          </a>
          <a href="#" className="text-white hover:text-pink-200 transition-colors duration-300">
            Hugging Face
          </a>
          <a href="#" className="text-white hover:text-pink-200 transition-colors duration-300">
            Linkedin
          </a>
        </nav>

        <button
          className="md:hidden text-white hover:text-pink-200 transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <a href="#" className="block text-white hover:text-pink-200 transition-colors duration-300">
            Home
          </a>
          <a href="#" className="block text-white hover:text-pink-200 transition-colors duration-300">
            About
          </a>
          <a href="#" className="block text-white hover:text-pink-200 transition-colors duration-300">
            Services
          </a>
          <a href="#" className="block text-white hover:text-pink-200 transition-colors duration-300">
            Contact
          </a>
        </div>
      )}
    </header>
  );
}