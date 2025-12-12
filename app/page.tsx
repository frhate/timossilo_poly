import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import CategoriesSection from "@/components/categories-section"
import BrandsSection from "@/components/brands-section"
import FeaturesSection from "@/components/features-section"
import NewArrivals from "@/components/new-arrivals";
import { getBrands } from "@/lib/actions/brands"

export default async function Home() {
    const supabase = await createClient()

    const { data: categories } = await supabase.from("categories").select("*").order("created_at", { ascending: false })
    const brands = await getBrands()

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="flex">
                <main className="flex-1">
                    <HeroSection />
                    <CategoriesSection categories={categories || []} />
                    <NewArrivals/>
                    <BrandsSection brands={brands} />
                    <FeaturesSection />
                </main>
            </div>
        </div>
    )
}


