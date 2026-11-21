import {createClient} from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import ProductGrid from "@/components/product-grid"
import CategoriesSidebar from "@/components/categories-sidebar"
import BrandSlider from "@/components/brand-slider"
import ProductsToolbar from "@/components/products-toolbar"
import PaginationControls from "@/components/pagination-controls"
import Breadcrumb from "@/components/navigation/breadcrumb"
import {getProductsListingMetadata} from "@/lib/seo/metadata"
import type {Metadata} from "next"
import {capitalize} from "@/lib/utils"
import {CreditCard, ShieldCheck, Truck} from "lucide-react"

interface SearchParams {
    category?: string
    search?: string
    brand?: string
    sort?: string
    page?: string
}

export async function generateMetadata({searchParams}: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
    const params = await searchParams
    return getProductsListingMetadata({
        brand: params.brand,
        category: params.category,
        search: params.search,
    })
}

const PRODUCTS_PER_PAGE = 12

function getOrderBy(sort?: string): { column: string; ascending: boolean } {
    switch (sort) {
        case "price-asc":
            return {column: "price", ascending: true}
        case "price-desc":
            return {column: "price", ascending: false}
        case "name-asc":
            return {column: "name", ascending: true}
        default:
            return {column: "updated_at", ascending: false}
    }
}

export default async function ProductsPage({
                                                 searchParams,
                                             }: {
    searchParams: Promise<SearchParams>
}) {
    const supabase = await createClient()
    const params = await searchParams
    const currentPage = Math.max(1, parseInt(params.page || "1"))
    const {column, ascending} = getOrderBy(params.sort)

    const searchTerm = params.search?.trim().replace(/[(),]/g, " ")

    // Run the independent lookups in parallel to avoid extra round trips.
    const [
        {data: brands},
        {data: categories},
        categoryLookup,
        brandLookup,
    ] = await Promise.all([
        supabase.from("brands").select("*"),
        supabase.from("categories").select("*"),
        params.category
            ? supabase
                .from("categories")
                .select("id")
                .eq("slug", params.category)
                .maybeSingle()
            : Promise.resolve({data: null as { id: string } | null}),
        params.brand
            ? supabase
                .from("brands")
                .select("id")
                .eq("slug", params.brand)
                .maybeSingle()
            : Promise.resolve({data: null as { id: string } | null}),
    ])

    // Only fetch the columns the product grid actually renders.
    let query = supabase
        .from("products")
        .select("id, name, price, image_urls, stock, category_id, brand_id", {
            count: "exact",
        })

    if (params.category && categoryLookup.data) {
        query = query.eq("category_id", categoryLookup.data.id)
    }

    if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`)
    }

    if (params.brand && brandLookup.data) {
        query = query.eq("brand_id", brandLookup.data.id)
    }

    const offset = (currentPage - 1) * PRODUCTS_PER_PAGE
    const {data: products, error, count} = await query
        .order(column, {ascending})
        .range(offset, offset + PRODUCTS_PER_PAGE - 1)

    if (error) {
        console.error("Error fetching products:", error)
    }

    const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE)

    const title = params.brand
        ? capitalize(params.brand)
        : params.category
            ? capitalize(params.category)
            : params.search
                ? `Résultats pour « ${params.search} »`
                : "Tous les produits"

    const description = params.brand
        ? `La sélection ${capitalize(params.brand)} — smartphones et accessoires originaux.`
        : params.category
            ? `Découvrez notre sélection ${capitalize(params.category)} au meilleur prix.`
            : params.search
                ? `Les produits correspondant à votre recherche « ${params.search} ».`
                : "Smartphones et accessoires originaux, livrés partout en Algérie."

    const breadcrumbItems = [
        ...(params.category
            ? [{label: "Catégories", href: "/products"}, {label: capitalize(params.category)}]
            : params.brand
                ? [{label: "Marques", href: "/products"}, {label: capitalize(params.brand)}]
                : [{label: title}]),
    ]

    return (
        <div className="min-h-screen bg-background">
            <Navigation/>

            <main className="mx-auto max-w-[1600px] px-3 pb-16 pt-4 sm:px-4 sm:pt-6 lg:px-8 lg:pt-8">
                <Breadcrumb items={breadcrumbItems}/>

                {/* Page header */}
                <header className="relative mb-6 overflow-hidden rounded-3xl border border-border/60 bg-card px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-primary/15 blur-3xl"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-primary/10 blur-3xl"
                    />

                    <div className="relative">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Catalogue Timossilo
                        </p>
                        <h1 className="mt-2.5 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
                            {title}
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                                <Truck className="size-3.5"/>
                                Livraison 2 à 5 jours
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                                <CreditCard className="size-3.5"/>
                                Paiement à la livraison
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                                <ShieldCheck className="size-3.5"/>
                                Produits garantis
                            </span>
                        </div>
                    </div>
                </header>

                {/* Brand slider */}
                {brands && brands.length > 0 && (
                    <BrandSlider brands={brands} selectedBrand={params.brand}/>
                )}

                <div className="flex items-start gap-6">
                    {/* Sidebar (desktop) */}
                    <CategoriesSidebar categories={categories || []}/>

                    {/* Main content */}
                    <div className="min-w-0 flex-1">
                        <ProductsToolbar resultCount={count || 0}/>

                        {error ? (
                            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
                                <p className="font-semibold text-destructive">
                                    Erreur lors du chargement
                                </p>
                                <p className="mt-1 break-words text-sm text-muted-foreground">
                                    {error.message}
                                </p>
                            </div>
                        ) : products && products.length > 0 ? (
                            <>
                                <ProductGrid products={products}/>

                                {totalPages > 1 && (
                                    <PaginationControls
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        searchParams={{
                                            category: params.category,
                                            search: params.search,
                                            brand: params.brand,
                                            sort: params.sort,
                                        }}
                                    />
                                )}
                            </>
                        ) : (
                            <ProductGrid products={[]}/>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
