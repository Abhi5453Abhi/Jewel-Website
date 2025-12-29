import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#BFA06D] text-[#5A4A3A] py-16 px-4 md:px-12 text-base">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <h2 className="font-display text-3xl font-bold mb-4">VP Jewelry</h2>
          <p className="mb-6 opacity-80 leading-relaxed max-w-xs">
            True luxury is understanding that every piece holds a story. We help you tell yours with timeless elegance.
          </p>
          <div className="flex gap-4">
             <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
             <Github className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
             <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
             <Linkedin className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-bold mb-6 tracking-widest uppercase text-sm md:text-base">Marketplace</h3>
          <ul className="space-y-4 opacity-80 text-base md:text-lg">
            <li className="cursor-pointer hover:text-white transition-colors">All Products</li>
            <li className="cursor-pointer hover:text-white transition-colors">New Releases</li>
            <li className="cursor-pointer hover:text-white transition-colors">Featured</li>
            <li className="cursor-pointer hover:text-white transition-colors">Collections</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 tracking-widest uppercase text-sm md:text-base">Resources</h3>
          <ul className="space-y-4 opacity-80 text-base md:text-lg">
            <li className="cursor-pointer hover:text-white transition-colors">Contact Us</li>
            <li className="cursor-pointer hover:text-white transition-colors">FAQ</li>
            <li className="cursor-pointer hover:text-white transition-colors">Terms of Service</li>
            <li className="cursor-pointer hover:text-white transition-colors">Privacy Policy</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
           <h3 className="font-bold mb-6 tracking-widest uppercase text-sm md:text-base">You can be one step ahead.</h3>
           <p className="mb-4 opacity-80 text-base md:text-lg">Sign up to hear about our latest products.</p>
           <div className="flex bg-white/20 p-1.5 rounded">
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="bg-transparent flex-1 px-5 py-3 md:py-4 text-base md:text-lg outline-none placeholder-[#5A4A3A]/60"
             />
             <button className="bg-white/40 hover:bg-white text-[#5A4A3A] px-6 py-3 md:py-4 rounded transition-colors font-medium text-lg md:text-xl">
               →
             </button>
           </div>
        </div>
      </div>
    </footer>
  );
}

