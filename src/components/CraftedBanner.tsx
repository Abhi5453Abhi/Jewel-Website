import React from 'react';
import Image from 'next/image';

export function CraftedBanner() {
  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] bg-cream overflow-hidden">
       {/* Background Video */}
       <video
         autoPlay
         loop
         muted
         playsInline
         preload="auto"
         className="absolute inset-0 w-full h-full object-cover object-top z-0"
       >
         <source src="/crafted-video.mp4" type="video/mp4" />
       </video>
       
       {/* Fallback Image (shown if video fails to load) */}
       <Image 
         src="https://images.unsplash.com/photo-1543238163-4029e3919980?q=80&w=2669&auto=format&fit=crop" 
         alt="Crafted with Passion" 
         fill
         sizes="100vw"
         unoptimized
         className="absolute inset-0 object-cover object-top z-0"
         style={{ display: 'none' }}
       />
       
       <div className="absolute right-0 top-0 h-full w-20 md:w-28 bg-[#C28978] flex items-center justify-center shadow-lg z-10">
         <span className="-rotate-90 text-white font-display text-2xl md:text-4xl lg:text-5xl tracking-widest whitespace-nowrap">Crafted with Passion ❦</span>
       </div>
    </section>
  );
}

