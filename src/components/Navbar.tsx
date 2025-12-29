'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '#new-releases', label: 'New Releases' },
    { href: '#gifts', label: 'Gifts' },
    { href: '#men', label: 'Men' },
    { href: '#women', label: 'Women' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 w-full py-4 md:py-6 px-4 md:px-12 flex justify-between items-center z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-cream/95 backdrop-blur-md shadow-md text-neutral' 
            : 'bg-transparent text-white'
        }`}
      >
        {/* Left Side - Links and Icons */}
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          {/* Navigation Links - Desktop Only */}
          <div className="hidden md:flex gap-6 lg:gap-8 font-medium text-sm md:text-base tracking-wide">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <Search 
              className={`w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer hover:text-primary transition-colors ${
                isScrolled ? 'text-neutral' : 'text-white'
              }`} 
            />
            <User 
              className={`w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer hover:text-primary transition-colors ${
                isScrolled ? 'text-neutral' : 'text-white'
              }`} 
            />
            <ShoppingBag 
              className={`w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer hover:text-primary transition-colors ${
                isScrolled ? 'text-neutral' : 'text-white'
              }`} 
            />
          </div>
          
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-neutral' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-neutral' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Logo - Right */}
        <Link 
          href="/" 
          className={`text-2xl md:text-3xl lg:text-4xl font-display font-bold hover:opacity-80 transition-opacity ${
            isScrolled ? 'text-neutral' : 'text-white'
          }`}
        >
          VP<br/>
          <span className="text-xs md:text-sm lg:text-base tracking-widest font-sans font-normal">
            Jewelry
          </span>
        </Link>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Mobile Menu Panel */}
          <div 
            className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-cream shadow-2xl z-[61] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-8 pt-24">
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-neutral hover:text-primary transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-neutral text-lg font-medium tracking-wide hover:text-primary transition-colors border-b border-neutral/10 pb-4"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Action Icons */}
              <div className="flex gap-6 mt-8 pt-8 border-t border-neutral/20">
                <button className="flex items-center gap-2 text-neutral hover:text-primary transition-colors">
                  <Search className="w-5 h-5" />
                  <span className="text-sm font-medium">Search</span>
                </button>
                <button className="flex items-center gap-2 text-neutral hover:text-primary transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Account</span>
                </button>
                <button className="flex items-center gap-2 text-neutral hover:text-primary transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-sm font-medium">Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
