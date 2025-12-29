"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { CachedImage } from './CachedImage';
import { Product } from '@/lib/types';

export function LastArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?status=active');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      // Get latest 3 products
      setProducts(data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-20 px-4 md:px-12 bg-cream">
       <div className="text-center mb-16">
         <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary mb-2">Latest Arrivals</h2>
         <p className="text-neutral text-base md:text-lg tracking-wide">Indulge in what we offer</p>
       </div>
       
       {loading ? (
         <div className="text-center py-12">
           <p className="text-neutral">Loading products...</p>
         </div>
       ) : products.length === 0 ? (
         <div className="text-center py-12">
           <p className="text-neutral">No products available at the moment.</p>
         </div>
       ) : (
         <>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative h-80 mb-4 overflow-hidden rounded-md bg-gray-50">
                    {product.image_url ? (
                      <CachedImage
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral">
                        No Image
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white text-neutral hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-left">
                    <h3 className="text-neutral-800 font-medium text-base md:text-lg mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-primary font-bold text-lg md:text-xl mb-5">{formatPrice(product.price)}</p>
                    <button className="w-full py-4 md:py-5 bg-[#D4AF37]/20 text-[#D4AF37] font-semibold uppercase text-sm md:text-base tracking-wider hover:bg-[#D4AF37] hover:text-white transition-colors rounded">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
           </div>
           
           <div className="flex justify-center mt-12 gap-3">
             <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary text-primary text-lg md:text-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors">←</button>
             <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary text-primary text-lg md:text-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors">→</button>
           </div>
         </>
       )}
    </section>
  );
}
