"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SortSelect from "@/components/sort-select"

interface ProductsToolbarProps {
    resultCount: number
}

export default function ProductsToolbar({ resultCount }: ProductsToolbarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "")

    const openFilters = () => {
        const event = new CustomEvent("toggleMobileSidebar")
        window.dispatchEvent(event)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        const term = searchTerm.trim()
        if (term) params.set("search", term)
        else params.delete("search")
        params.delete("page")
        router.push(`/products?${params.toString()}`)
    }

    return (
        <div className="sticky top-20 z-30 -mx-3 mb-6 border-b border-border bg-background/85 px-3 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un produit..."
                            className="h-11 rounded-full pl-10 pr-10"
                            aria-label="Rechercher"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Effacer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={openFilters}
                        className="h-11 rounded-full lg:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filtres
                    </Button>
                    <SortSelect />
                </div>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{resultCount}</span>{" "}
                produit{resultCount !== 1 ? "s" : ""} trouvé{resultCount !== 1 ? "s" : ""}
            </p>
        </div>
    )
}
