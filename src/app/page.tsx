import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ShopByCategory } from "@/components/ShopByCategory";
import { CraftedBanner } from "@/components/CraftedBanner";
import { LastArrivals } from "@/components/LastArrivals";
import { GiftsSection } from "@/components/GiftsSection";
import { DiamondShapes } from "@/components/DiamondShapes";
import { UniquePiece } from "@/components/UniquePiece";
import { SatisfiedCustomers } from "@/components/SatisfiedCustomers";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <ShopByCategory />
      <CraftedBanner />
      <LastArrivals />
      <GiftsSection />
      <DiamondShapes />
      <UniquePiece />
      <SatisfiedCustomers />
      <Footer />
    </main>
  );
}
