// app/products/[id]/page.tsx
import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import ProductDetails from "@/components/product-details"
import RelatedProducts from "@/components/related-products"
import { notFound } from "next/navigation"
import { getProductMetadata } from "@/lib/seo/metadata"
import ProductSchema from "@/components/seo/product-schema"
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema"
import type { Metadata } from "next"

const SITE_URL = "https://timossilo-polymobile.com"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const supabase = await createClient()
    const { id } = await params

    const { data: product } = await supabase
        .from("products")
        .select("*, categories(name, id, slug), brands(id, name, slug)")
        .eq("id", id)
        .single()

    if (!product) {
        return {
            title: "Produit non trouvé | Timossilo",
        }
    }

    return getProductMetadata(product)
}

export default async function ProductDetailPage({params,
                                                }: {
    params: Promise<{ id: string }>
}) {
    const supabase = await createClient()
    const { id } = await params

    const { data: product } = await supabase
        .from("products")
        .select("*, categories(name, id, slug), brands(id, name, slug)")
        .eq("id", id)
        .single()

    if (!product) {
        notFound()
    }

    const productUrl = `${SITE_URL}/products/${product.slug || product.id}`

    return (
        <div>
            <ProductSchema product={product} url={productUrl} />
            <BreadcrumbSchema
                items={[
                    { name: "Accueil", url: SITE_URL },
                    { name: "Produits", url: `${SITE_URL}/products` },
                    { name: product.categories?.name || "Catégorie", url: `${SITE_URL}/products?category=${product.categories?.slug || ""}` },
                    { name: product.name, url: productUrl },
                ]}
            />
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