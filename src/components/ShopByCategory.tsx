import React from 'react';
import Image from 'next/image';

export function ShopByCategory() {
  return (
    <section className="bg-cream text-center relative w-full pt-10 pb-20 md:py-32">
      {/* Header */}
      <div className="px-4 mb-8 md:mb-16">
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl mb-2 text-primary">Shop By Category</h2>
        <p className="text-neutral text-sm md:text-lg tracking-wide">Indulge in what we offer</p>
      </div>

      {/* Mobile View - Vertical Stack of Wide Cards */}
      <div className="md:hidden flex flex-col px-4 gap-6 w-full">

        {/* Bracelets */}
        <div className="group relative w-full h-64 rounded-3xl overflow-hidden shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
            alt="Bracelets"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 w-full flex justify-center">
            <span className="text-white text-3xl font-display italic tracking-wide drop-shadow-lg">
              Elegant Bracelets
            </span>
          </div>
        </div>

        {/* Necklaces */}
        <div className="group relative w-full h-64 rounded-3xl overflow-hidden shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
            alt="Necklaces"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-6 right-6 text-right">
            <span className="text-white text-3xl font-display italic block drop-shadow-lg">Divine</span>
            <span className="text-white text-2xl font-serif tracking-widest uppercase text-xs drop-shadow-md">Necklaces</span>
          </div>
        </div>

        {/* Rings - Featured */}
        <div className="group relative w-full h-72 rounded-3xl overflow-hidden shadow-md">
          <Image
            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
            alt="Rings"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute top-1/2 -translate-y-1/2 left-8 text-left">
            <span className="text-white text-4xl font-display italic block mb-2 drop-shadow-lg">Forever</span>
            <span className="text-white text-3xl font-display block drop-shadow-lg">Rings</span>
            <button className="mt-4 bg-white/20 backdrop-blur-md border border-white/40 text-white px-6 py-2 rounded-full text-sm hover:bg-white hover:text-primary transition-colors">
              Shop Now
            </button>
          </div>
        </div>

        {/* Earrings */}
        <div className="group relative w-full h-64 rounded-3xl overflow-hidden shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
            alt="Earrings"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent" />
          <div className="absolute top-8 right-8 text-right max-w-[150px]">
            <span className="text-white text-3xl font-display italic leading-tight drop-shadow-lg">
              Stunning Every Ear
            </span>
          </div>
        </div>

        {/* Sets */}
        <div className="group relative w-full h-64 rounded-3xl overflow-hidden shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=800&auto=format&fit=crop"
            alt="Sets"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/30 p-6 rounded-2xl">
              <span className="text-white text-3xl font-display italic drop-shadow-lg">Complete Sets</span>
            </div>
          </div>
        </div>

      </div>

      {/* Desktop View - Retaining the previous horizontal layout */}
      <div className="hidden md:flex justify-center items-center gap-8 h-screen max-h-[90vh] px-4">

        {/* Bracelets */}
        <div className="group relative w-40 h-full overflow-hidden rounded-lg cursor-pointer">
          <Image
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
            alt="Bracelets"
            fill
            sizes="160px"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors" />
          <span className="absolute bottom-12 left-1/2 -translate-x-1/2 -rotate-90 origin-center text-white text-3xl tracking-widest font-display whitespace-nowrap drop-shadow-lg">
            Bracelets
          </span>
        </div>

        {/* Necklaces */}
        <div className="group relative w-40 h-full overflow-hidden rounded-lg cursor-pointer">
          <Image
            src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
            alt="Necklaces"
            fill
            sizes="160px"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors" />
          <span className="absolute bottom-12 left-1/2 -translate-x-1/2 -rotate-90 origin-center text-white text-3xl tracking-widest font-display whitespace-nowrap drop-shadow-lg">
            Necklaces
          </span>
        </div>

        {/* Rings - Center Feature */}
        <div className="relative w-80 h-full bg-white rounded-lg shadow-xl flex flex-col items-center justify-center p-8 cursor-pointer transform -translate-y-4 hover:-translate-y-6 transition-transform duration-300">
          <div className="relative w-full h-64 mb-6">
            <Image
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
              alt="Rings"
              fill
              sizes="320px"
              unoptimized
              className="object-contain"
            />
          </div>
          <span className="text-primary text-5xl font-display mb-2">Rings</span>
          <span className="text-neutral text-3xl">→</span>
        </div>

        {/* Earrings */}
        <div className="group relative w-40 h-full overflow-hidden rounded-lg cursor-pointer">
          <Image
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
            alt="Earrings"
            fill
            sizes="160px"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors" />
          <span className="absolute bottom-12 left-1/2 -translate-x-1/2 -rotate-90 origin-center text-white text-3xl tracking-widest font-display whitespace-nowrap drop-shadow-lg">
            Earrings
          </span>
        </div>

        {/* Sets */}
        <div className="group relative w-40 h-full overflow-hidden rounded-lg cursor-pointer">
          <Image
            src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=800&auto=format&fit=crop"
            alt="Sets"
            fill
            sizes="160px"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors" />
          <span className="absolute bottom-12 left-1/2 -translate-x-1/2 -rotate-90 origin-center text-white text-3xl tracking-widest font-display whitespace-nowrap drop-shadow-lg">
            Sets
          </span>
        </div>

      </div>
    </section>
  );
}
