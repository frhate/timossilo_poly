// app/products/[id]/page.tsx
import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import ProductDetails from "@/components/product-details"
import RelatedProducts from "@/components/related-products"
import { notFound } from "next/navigation"

export default async function ProductDetailPage({params,
                                                }: {
    params: Promise<{ id: string }>
}) {
    const supabase = await createClient()
    const { id } = await params

    const { data: product } = await supabase
        .from("products")
        .select("*, categories(name, id), brands(id, name)")
        .eq("id", id)
        .single()

    if (!product) {
        notFound()
    }

    return (
        <div>
            <Navigation />
            <ProductDetails product={product} />
            <div className="container mx-auto px-4 max-w-7xl">
                <RelatedProducts
                    currentProductId={product.id}
                    brandId={product.brand_id ?? null}
                    brandName={product.brands?.name ?? null}
                    categoryId={product.category_id}
                />
            </div>
        </div>
    )
}