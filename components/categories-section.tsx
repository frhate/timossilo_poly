import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { getCategories } from "@/lib/actions/categories"

export default async function CategoriesSection() {
    const categories = await getCategories()

    if (categories.length === 0) return null

    return (
        <section
            id="categories"
            className="relative w-full bg-gradient-to-b from-background to-secondary/30 py-16 md:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 text-center md:mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                        <Sparkles className="h-4 w-4" />
                        Explorez nos catégories
                    </div>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Trouvez ce que vous{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            cherchez
                        </span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Une sélection premium de produits technologiques, organisée pour vous faire gagner du temps.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${category.slug}`}
                            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative flex items-start justify-between">
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <span className="text-lg font-bold">{category.name.charAt(0)}</span>
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                            </div>
                            <h3 className="relative mt-5 text-lg font-semibold text-foreground">
                                {category.name}
                            </h3>
                            <p className="relative mt-1 text-sm text-muted-foreground">
                                Découvrir la sélection
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
