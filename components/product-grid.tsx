"use client"

import Link from "next/link"
import ProductCard from "@/components/product-card"
import {ArrowRight, PackageSearch} from "lucide-react"

interface Product {
    id: string
    name: string
    price: number
    image_urls: string[]
    stock: number
}

export default function ProductGrid({products}: { products: Product[] }) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card/50 px-6 py-20 text-center">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-foreground">
                    <PackageSearch className="size-7" strokeWidth={1.5}/>
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                    Aucun produit trouvé
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Essayez d&apos;ajuster vos filtres ou votre recherche pour afficher plus de résultats.
                </p>
                <Link
                    href="/products"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                    Voir tous les produits
                    <ArrowRight className="size-4"/>
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
    )
}
