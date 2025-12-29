import React from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    quote: "The quality is absolutely stunning. I've never received so many compliments on a piece of jewelry before."
  },
  {
    id: 2,
    name: 'Jessica T.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    quote: "Exceptional service and beautiful packaging. It felt like a true luxury experience from start to finish."
  },
  {
    id: 3,
    name: 'Emily R.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    quote: "My custom ring is everything I dreamed of. The attention to detail is unmatched."
  },
];

export function SatisfiedCustomers() {
  return (
    <section className="py-24 px-4 md:px-12 bg-cream text-center">
       <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary mb-16">Our Satisfied Customers</h2>
       <div className="flex flex-col md:flex-row justify-center gap-8 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-[#EADED2]/50 p-8 md:p-10 rounded-2xl flex flex-col items-center flex-1 hover:-translate-y-2 transition-transform duration-300">
               <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-6 border-2 border-white shadow-sm">
                 <Image src={t.image} alt={t.name} width={96} height={96} unoptimized className="object-cover w-full h-full" />
               </div>
               <p className="text-base md:text-lg italic text-neutral mb-6 leading-relaxed">"{t.quote}"</p>
               <h4 className="font-display text-primary font-bold text-lg md:text-xl">{t.name}</h4>
            </div>
          ))}
       </div>
       
       <div className="flex justify-center mt-12 gap-4">
         <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary/30 text-primary text-lg md:text-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors">←</button>
         <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary/30 text-primary text-lg md:text-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors">→</button>
       </div>
    </section>
  );
}

