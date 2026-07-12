"use client"

    import ProductCard from "@/components/product-card"
    import { PackageSearch } from "lucide-react"
    import Link from "next/link"

    interface Product {
        id: string
        name: string
        price: number
        image_urls: string[]
        stock: number
    }

    export default function ProductGrid({ products }: { products: Product[] }) {
        if (products.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-20 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <PackageSearch className="h-8 w-8" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-foreground">
                        Aucun produit trouvé
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        Essayez d&apos;ajuster vos filtres ou votre recherche pour voir plus de résultats.
                    </p>
                    <Link
                        href="/products"
                        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30"
                    >
                        Voir tous les produits
                    </Link>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )
    }