import React from 'react';
import Image from 'next/image';

export function GiftsSection() {
  return (
    <section className="py-20 px-4 md:px-12 bg-cream flex flex-col md:flex-row items-center gap-12 md:gap-24">
      <div className="flex-1 text-left pl-0 md:pl-12">
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary mb-6">Gifts of the season</h2>
        <p className="text-neutral text-base md:text-lg mb-10 leading-relaxed max-w-md">
          When it comes to celebration we strive to make your experience as brilliant as our jewelry with the perfect pieces for every occasion.
        </p>
        <button className="bg-[#C0914B] text-white px-12 py-4 md:px-16 md:py-5 rounded-none uppercase text-sm md:text-base tracking-widest hover:bg-[#a37a3d] transition-colors shadow-lg font-semibold">
          Explore Now
        </button>
      </div>
      <div className="flex-1 relative h-[400px] md:h-[500px] w-full rounded-[4rem] md:rounded-[6rem] overflow-hidden shadow-2xl">
         <Image 
           src="/gifts-of-the-season.jpg" 
           alt="Gifts of the season" 
           fill
           sizes="(max-width: 768px) 100vw, 50vw"
           unoptimized
           className="object-cover"
         />
      </div>
    </section>
  );
}

