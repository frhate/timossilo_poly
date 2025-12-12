// typescript
import Link from "next/link"
import Image from "next/image"
import {createClient} from "@/lib/supabase/server"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {ArrowRight, Sparkles} from "lucide-react"

type Product = {
    id: string
    name: string
    price: number | string
    image_url?: string | null
    brand?: string | null
    created_at?: string | null
}

export default async function NewArrivals() {
    try {
        const supabase = await createClient()
        const {data, error} = await supabase
            .from("products")
            .select("id, name, price, image_url, created_at, brands(name)")
            .order("created_at", {ascending: false})
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
                maximumFractionDigits: 2
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
            <section className="py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div
                            className="inline-flex items-center gap-3 rounded-full px-3 py-2 bg-gradient-to-r from-primary/10 to-transparent">
                            <Sparkles className="w-5 h-5 text-primary"/>
                            <h2 className="text-xl sm:text-2xl font-semibold">Nouvelle Arrivage</h2>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Découvrez nos derniers produits
                            sélectionnés</p>
                    </div>

                    <div className="flex justify-center mb-6">
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href="/products" className="flex items-center gap-2 px-3">
                                Voir tout
                                <ArrowRight className="w-4 h-4"/>
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                        {products.map((product: Product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="w-full"
                                aria-label={`Voir ${product.name}`}
                            >
                                <Card
                                    className="h-full group overflow-hidden hover:shadow-xl transition-shadow duration-200 border border-transparent rounded-xl">
                                    <CardContent className="p-3 flex flex-col h-full">
                                        <div
                                            className="relative w-full rounded-lg overflow-hidden bg-muted/10 aspect-[4/3]">
                                            <Image
                                                src={product.image_url ?? "/placeholder.jpg"}
                                                alt={product.name ?? "Produit"}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 640px) 100vw, 320px"
                                            />
                                            {isNew(product.created_at) && (
                                                <Badge
                                                    className="absolute left-2 top-2 bg-primary text-primary-foreground text-[11px]">
                                                    Nouveau
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="mt-3 flex-1 flex flex-col justify-between">
                                            <div className="text-center">
                                                <h3 className="text-sm sm:text-base font-medium line-clamp-2 text-foreground">
                                                    {product.name}
                                                </h3>
                                                {product.brand && (
                                                    <div
                                                        className="text-xs text-muted-foreground mt-1">{product.brand}</div>
                                                )}
                                                <p className="mt-2 text-primary font-semibold text-base">
                                                    {formatPrice(product.price)}
                                                </p>
                                            </div>

                                            <div className="mt-3">
                                                <Button size="sm" className="w-full rounded-md">
                                                    Voir détails
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        )
    } catch (err) {
        console.error("Unexpected error in NewArrivals:", err)
        return null
    }
}