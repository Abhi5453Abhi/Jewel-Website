import React from 'react';
import { Gem, Circle, Square, Hexagon, Octagon, Triangle, Heart } from 'lucide-react';

const shapes = [
  { name: 'Round', icon: Circle },
  { name: 'Asscher', icon: Square },
  { name: 'Pear', icon: Triangle },
  { name: 'Marquise', icon: Hexagon },
  { name: 'Emerald', icon: Octagon },
  { name: 'Cushion', icon: Square },
  { name: 'Heart', icon: Heart },
  { name: 'Radiant', icon: Octagon },
];

export function DiamondShapes() {
  return (
    <section className="py-20 px-4 md:px-12 bg-cream text-center">
      <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary mb-12">Explore Diamonds</h2>
      
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {shapes.map((shape) => (
          <div key={shape.name} className="flex flex-col items-center gap-4 group cursor-pointer">
             <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
               <shape.icon className="w-8 h-8 md:w-10 md:h-10 stroke-1" />
             </div>
             <span className="text-sm md:text-base uppercase tracking-widest text-neutral group-hover:text-primary transition-colors">{shape.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

