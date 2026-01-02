import {createClient} from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import ProductGrid from "@/components/product-grid"
import SearchBar from "@/components/search-bar"
import CategoriesSidebar from "@/components/categories-sidebar"
import {Suspense} from "react"
import CategoriesSection from "@/components/categories-section";

interface SearchParams {
    category?: string
    search?: string
    brand?: string
}

export default async function ProductsPage({
                                               searchParams,
                                           }: {
    searchParams: Promise<SearchParams>
}) {
    const supabase = await createClient()
    const params = await searchParams

    let query = supabase
        .from("products")
        .select("*, categories(name, slug)")

    if (params.category) {
        const {data: category} = await supabase
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
        const {data: brand} = await supabase
            .from("brands")
            .select("id")
            .eq("slug", params.brand)
            .single()

        if (brand) {
            query = query.eq("brand_id", brand.id)
        }
    }


    const {data: products, error} = await query.order("updated_at", {ascending: false})
    const {data: categories} = await supabase.from("categories").select("*")

    if (error) {
        console.error("Error fetching products:", error)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navigation/>

            <div className="flex flex-col lg:flex-row">
                {/* Sidebar */}
                <CategoriesSidebar categories={categories || []}/>

                {/* Main Content */}
                <main className="flex-1 w-full">
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-[1600px]">
                        {/* Header Section */}
                        <div className="mb-4 sm:mb-6 lg:mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                                {params.brand ? (
                                    <>
                                        <span className="text-blue-600 block sm:inline">{params.brand}</span>
                                        {" "}
                                        <span className="text-gray-700">Smartphones</span>
                                    </>
                                ) : params.category ? (
                                    "Produits"
                                ) : (
                                    "Tous les Produits"
                                )}
                            </h1>
                            {products && (
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <p className="text-sm sm:text-base text-gray-600 font-medium">
                                        {products.length} produit{products.length !== 1 ? "s" : ""} trouvé{products.length !== 1 ? "s" : ""}
                                    </p>
                                    {(params.category || params.brand || params.search) && (
                                        <a
                                            href="/products"
                                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 underline font-medium"
                                        >
                                            Réinitialiser les filtres
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6 sm:mb-8">
                            <SearchBar/>
                        </div>

                        {/* Products Grid */}
                        <Suspense fallback={
                            <div className="flex justify-center items-center py-16 sm:py-20 lg:py-24">
                                <div className="flex flex-col items-center gap-3 sm:gap-4">
                                    <div
                                        className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                                    <p className="text-sm sm:text-base text-gray-600 animate-pulse">Chargement...</p>
                                </div>
                            </div>
                        }>
                            {error ? (
                                <div className="text-center py-8 sm:py-12 mx-auto max-w-md">
                                    <div
                                        className="bg-red-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-red-100">
                                        <svg
                                            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500 mb-3 sm:mb-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                        </svg>
                                        <p className="text-red-600 font-semibold mb-2 text-sm sm:text-base">
                                            Erreur lors du chargement
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 break-words">{error.message}</p>
                                    </div>
                                </div>
                            ) : products && products.length > 0 ? (
                                <ProductGrid products={products}/>
                            ) : (
                                <div className="text-center py-12 sm:py-16 lg:py-20 mx-auto max-w-md px-4">
                                    <div
                                        className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
                                        <svg
                                            className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4 sm:mb-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                            />
                                        </svg>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                            Aucun produit trouvé
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                            Essayez d'ajuster vos filtres ou votre recherche
                                        </p>
                                        <a
                                            href="/products"
                                            className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Voir tous les produits
                                        </a>
                                    </div>
                                </div>
                            )}
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    )
}