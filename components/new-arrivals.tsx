// typescript
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

type Product = {
    id: string
    name: string
    price: number | string
    image_urls: string[]
    brand?: string | null
    created_at?: string | null
}

export default async function NewArrivals() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from("products")
            .select("id, name, price, image_urls, created_at, brands(name)")
            .order("created_at", { ascending: false })
            .limit(4)

        if (error) {
            console.error("Supabase error fetching new arrivals:", error)
            return null
        }

        const products: Product[] = (data as Product[] | null) ?? []
        if (!products.length) return null

        const formatPrice = (p: number | string) => {
            const num = typeof p === "number" ? p : parseFloat(String(p) || "0")
            return new Intl.NumberFormat("fr-DZ", {
                style: "currency",
                currency: "DZD",
                maximumFractionDigits: 2,
            }).format(num)
        }

        const isNew = (createdAt?: string | null) => {
            if (!createdAt) return false
            const created = new Date(createdAt)
            const now = new Date()
            const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
            return diffDays <= 7
        }

        return (
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col items-center text-center md:mb-14">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                            <Sparkles className="h-4 w-4" />
                            Nouveautés
                        </div>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                            Derniers{" "}
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                arrivages
                            </span>
                        </h2>
                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Découvrez les tout derniers produits sélectionnés pour vous.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product: Product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group"
                                aria-label={`Voir ${product.name}`}
                            >
                                <Card className="h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                                    <CardContent className="flex h-full flex-col p-3">
                                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted/30">
                                            <Image
                                                src={product.image_urls?.[0] ?? "/placeholder.jpg"}
                                                alt={product.name ?? "Produit"}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, 320px"
                                            />
                                            {isNew(product.created_at) && (
                                                <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow">
                                                    Nouveau
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-1 flex-col justify-between">
                                            <div className="text-center">
                                                <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                                                    {product.name}
                                                </h3>
                                                {product.brand && (
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {product.brand}
                                                    </div>
                                                )}
                                                <p className="mt-2 text-lg font-bold text-primary">
                                                    {formatPrice(product.price)}
                                                </p>
                                            </div>

                                            <Button
                                                size="sm"
                                                className="mt-4 w-full rounded-lg"
                                            >
                                                Voir détails
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 flex justify-center">
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href="/products" className="flex items-center gap-2 px-3">
                                Voir tout
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        )
    } catch (err) {
        console.error("Unexpected error in NewArrivals:", err)
        return null
    }
}