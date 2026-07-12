import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import CategoriesSection from "@/components/categories-section"
import NewArrivals from "@/components/new-arrivals"
import BrandsSection from "@/components/brands-section"
import PromotionSection from "@/components/promotion-section"
import FeaturesSection from "@/components/features-section"
import TrustBand from "@/components/trust-band"
import FinalCta from "@/components/final-cta"
import { getBrands } from "@/lib/actions/brands"
import { getHomeMetadata } from "@/lib/seo/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = getHomeMetadata()

export default async function Home() {
    const supabase = await createClient()
    const brands = await getBrands()

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main>
                <HeroSection />
                <TrustBand />
                <CategoriesSection />
                <NewArrivals />
                <BrandsSection brands={brands} />
                <PromotionSection />
                <FeaturesSection />
                <FinalCta />
            </main>
        </div>
    )
}
