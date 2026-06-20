import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import BrandsSection from "@/components/brands-section"
import FeaturesSection from "@/components/features-section"
import NewArrivals from "@/components/new-arrivals";
import { getBrands } from "@/lib/actions/brands"
import PromotionSection from "@/components/promotion-section";
import { getHomeMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = getHomeMetadata();

export default async function Home() {
    const supabase = await createClient()
    const brands = await getBrands()

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="flex">
                <main className="flex-1">
                    <HeroSection />
                    <NewArrivals/>
                    <BrandsSection brands={brands} />
                    <PromotionSection/>
                    <FeaturesSection />
                </main>
            </div>
        </div>
    )
}
