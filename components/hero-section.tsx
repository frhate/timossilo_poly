import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import {
    ArrowRight,
    ShieldCheck,
    Truck,
    Headphones,
    Star,
    BadgeCheck,
} from "lucide-react"

type FeaturedProduct = {
    id: string
    name: string
    price: number
    image_urls: string[] | null
    brands?: { name: string } | null
}

export default async function HeroSection() {
    let featured: FeaturedProduct | null = null
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from("products")
            .select("id, name, price, image_urls, brands(name)")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()
        featured = (data as FeaturedProduct | null) ?? null
    } catch {
        featured = null
    }

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("fr-DZ", {
            style: "currency",
            currency: "DZD",
            maximumFractionDigits: 0,
        }).format(value)

    const trust = [
        { icon: ShieldCheck, label: "Produits authentiques" },
        { icon: Truck, label: "Livraison en 24-48h" },
        { icon: Headphones, label: "Support 24/7" },
    ]

    return (
        <section className="relative overflow-hidden bg-background">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl animate-blob" />
                <div
                    className="absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-accent/30 blur-3xl animate-blob"
                    style={{ animationDelay: "4s" }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.primary/10),transparent)]" />
            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-28">
                {/* Left: copy */}
                <div className="animate-fade-in">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                        Nouveautés 2026
                    </div>

                    <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        La technologie qui{" "}
                        <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-gradient-x">
                            vous ressemble
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        Smartphones, ordinateurs et accessoires des plus grandes marques.
                        Qualité garantie, prix compétitifs et livraison rapide dans toute l&apos;Algérie.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/products"
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
                        >
                            Découvrir la boutique
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="#categories"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 text-base font-semibold text-foreground backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/5"
                        >
                            Explorer les catégories
                        </Link>
                    </div>

                    {/* Trust row */}
                    <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
                        {trust.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2.5">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <span className="text-sm font-medium text-foreground/80">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: product showcase */}
                <div className="relative animate-scale-in [animation-delay:150ms]">
                    <div className="relative mx-auto max-w-md">
                        {/* Glow */}
                        <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 blur-2xl" />

                        {/* Device frame */}
                        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/70 p-6 shadow-2xl backdrop-blur-sm">
                            <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                Top vente
                            </div>

                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/40 to-muted/10">
                                {featured?.image_urls?.[0] ? (
                                    <Image
                                        src={featured.image_urls[0]}
                                        alt={featured.name}
                                        fill
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 420px"
                                        className="object-contain p-6"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-7xl">📱</div>
                                )}
                            </div>

                            <div className="mt-5">
                                {featured?.brands?.name && (
                                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                        {featured.brands.name}
                                    </p>
                                )}
                                <h3 className="mt-1 line-clamp-1 text-lg font-bold text-foreground">
                                    {featured?.name ?? "Produit en vedette"}
                                </h3>
                                {featured && (
                                    <p className="mt-2 text-2xl font-extrabold text-foreground">
                                        {formatPrice(featured.price)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Floating glass cards */}
                        <div className="absolute -left-4 top-10 hidden animate-float rounded-2xl border border-border bg-card/80 p-3 shadow-xl backdrop-blur sm:block">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                                    <BadgeCheck className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-foreground">Garantie 6 mois</p>
                                    <p className="text-[11px] text-muted-foreground">Sur tous les produits</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="absolute -right-3 bottom-16 hidden animate-float-slow rounded-2xl border border-border bg-card/80 p-3 shadow-xl backdrop-blur sm:block"
                            style={{ animationDelay: "2s" }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                                    <Truck className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-foreground">Livraison 24-48h</p>
                                    <p className="text-[11px] text-muted-foreground">Partout en Algérie</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
                <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1">
                    <span className="h-2 w-1 rounded-full bg-primary animate-scroll-indicator" />
                </div>
            </div>
        </section>
    )
}
