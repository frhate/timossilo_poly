import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import ProductGrid from "@/components/product-grid"
import CategoriesSidebar from "@/components/categories-sidebar"
import BrandSlider from "@/components/brand-slider"
import ProductsToolbar from "@/components/products-toolbar"
import Breadcrumb from "@/components/navigation/breadcrumb"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { getProductsListingMetadata } from "@/lib/seo/metadata"
import type { Metadata } from "next"
import { capitalize } from "@/lib/utils"

interface SearchParams {
    category?: string
    search?: string
    brand?: string
    sort?: string
    page?: string
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
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
            return { column: "price", ascending: true }
        case "price-desc":
            return { column: "price", ascending: false }
        case "name-asc":
            return { column: "name", ascending: true }
        default:
            return { column: "updated_at", ascending: false }
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
    const { column, ascending } = getOrderBy(params.sort)

    let query = supabase
        .from("products")
        .select("*, categories(name, slug)", { count: "exact" })

    if (params.category) {
        const { data: category } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", params.category)
            .single()

        if (category) {
            query = query.eq("category_id", category.id)
        }
    }

    if (params.search) {
        query = query.ilike("name", `%${params.search}%`)
    }

    if (params.brand) {
        const { data: brand } = await supabase
            .from("brands")
            .select("id")
            .eq("slug", params.brand)
            .single()

        if (brand) {
            query = query.eq("brand_id", brand.id)
        }
    }

    const offset = (currentPage - 1) * PRODUCTS_PER_PAGE
    const { data: brands } = await supabase.from("brands").select("*")
    const { data: products, error, count } = await query
        .order(column, { ascending })
        .range(offset, offset + PRODUCTS_PER_PAGE - 1)
    const { data: categories } = await supabase.from("categories").select("*")

    if (error) {
        console.error("Error fetching products:", error)
    }

    const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE)

    const buildPageUrl = (page: number) => {
        const queryParams = new URLSearchParams()
        if (params.category) queryParams.append("category", params.category)
        if (params.search) queryParams.append("search", params.search)
        if (params.brand) queryParams.append("brand", params.brand)
        if (params.sort) queryParams.append("sort", params.sort)
        queryParams.append("page", page.toString())
        return `/products?${queryParams.toString()}`
    }

    const title = params.brand
        ? capitalize(params.brand)
        : params.category
            ? capitalize(params.category)
            : params.search
                ? `Résultats pour "${params.search}"`
                : "Tous les produits"

    const breadcrumbItems = [
        ...(params.category
            ? [{ label: "Catégories", href: "/products" }, { label: capitalize(params.category) }]
            : params.brand
                ? [{ label: "Marques", href: "/products" }, { label: capitalize(params.brand) }]
                : [{ label: title }]),
    ]

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
                <Breadcrumb items={breadcrumbItems} />

                {/* Page header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                        {title}
                    </h1>
                    {params.brand && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            Smartphones &amp; accessoires {capitalize(params.brand)}
                        </p>
                    )}
                </div>

                {/* Brand slider */}
                {brands && brands.length > 0 && (
                    <div className="mb-6 rounded-2xl border border-border bg-card/40 p-4 sm:p-6">
                        <BrandSlider brands={brands} selectedBrand={params.brand} />
                    </div>
                )}

                <div className="flex gap-6">
                    {/* Sidebar (desktop) */}
                    <CategoriesSidebar categories={categories || []} />

                    {/* Main content */}
                    <div className="min-w-0 flex-1">
                        <ProductsToolbar resultCount={count || 0} />

                        {error ? (
                            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
                                <p className="font-semibold text-destructive">
                                    Erreur lors du chargement
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground break-words">
                                    {error.message}
                                </p>
                            </div>
                        ) : products && products.length > 0 ? (
                            <>
                                <ProductGrid products={products} />

                                {totalPages > 1 && (
                                    <div className="mt-10">
                                        <Pagination>
                                            <PaginationContent>
                                                {currentPage > 1 && (
                                                    <PaginationItem>
                                                        <PaginationPrevious href={buildPageUrl(currentPage - 1)} />
                                                    </PaginationItem>
                                                )}

                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                    const isNearCurrent = Math.abs(page - currentPage) <= 1
                                                    const isFirstOrLast = page === 1 || page === totalPages

                                                    if (!isNearCurrent && !isFirstOrLast) return null

                                                    return (
                                                        <PaginationItem key={page}>
                                                            <PaginationLink
                                                                href={buildPageUrl(page)}
                                                                isActive={page === currentPage}
                                                            >
                                                                {page}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    )
                                                })}

                                                {currentPage < totalPages && (
                                                    <PaginationItem>
                                                        <PaginationNext href={buildPageUrl(currentPage + 1)} />
                                                    </PaginationItem>
                                                )}
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        ) : (
                            <ProductGrid products={[]} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
