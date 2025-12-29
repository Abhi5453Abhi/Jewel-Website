import React from 'react';
import Image from 'next/image';

export function UniquePiece() {
  return (
    <section className="bg-[#B07E6C] py-24 px-4 md:px-24 relative overflow-hidden text-white rounded-t-[3rem] md:rounded-t-[5rem] -mt-10">
      <div className="flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto">
        <div className="flex-1 grid grid-cols-2 gap-4 h-full">
           <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden translate-y-8 shadow-lg">
             <Image 
               src="/gifts-of-the-season.jpg" 
               alt="Unique ring" 
               fill
               sizes="(max-width: 768px) 50vw, 25vw"
               unoptimized
               className="object-cover"
             />
           </div>
           <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg">
             <Image 
               src="/gifts-of-the-season.jpg" 
               alt="Jewelry crafting" 
               fill
               sizes="(max-width: 768px) 50vw, 25vw"
               unoptimized
               className="object-cover"
             />
           </div>
        </div>
        <div className="flex-1 text-left pl-0 md:pl-12">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">Looking for a UNIQUE PIECE of gold jewelry that reflects your personal style?</h2>
          <p className="opacity-90 text-base md:text-lg mb-10 max-w-md font-light leading-relaxed">
            Our customization service allows you to create a truly one-of-a-kind piece that is as unique as you are.
          </p>
          <button className="border-2 border-white px-12 py-4 md:px-16 md:py-5 hover:bg-white hover:text-[#B07E6C] transition-colors uppercase text-sm md:text-base tracking-widest font-semibold">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}

