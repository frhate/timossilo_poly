"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SortSelect from "@/components/sort-select"

interface ProductsToolbarProps {
    resultCount: number
}

const SEARCH_DEBOUNCE_MS = 300

export default function ProductsToolbar({ resultCount }: ProductsToolbarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const committedSearch = searchParams.get("search") ?? ""
    const [searchTerm, setSearchTerm] = useState(committedSearch)

    const openFilters = () => {
        const event = new CustomEvent("toggleMobileSidebar")
        window.dispatchEvent(event)
    }

    const commitSearch = useCallback(
        (term: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (term) params.set("search", term)
            else params.delete("search")
            params.delete("page")

            const query = params.toString()
            startTransition(() => {
                router.replace(query ? `/products?${query}` : "/products", {
                    scroll: false,
                })
            })
        },
        [router, searchParams, startTransition],
    )

    // Keep the input in sync when the URL changes (back/forward, filter links).
    useEffect(() => {
        setSearchTerm(committedSearch)
    }, [committedSearch])

    // Live search: wait for a short pause instead of requiring a submit.
    useEffect(() => {
        const term = searchTerm.trim()
        if (term === committedSearch) return

        const timeout = setTimeout(() => commitSearch(term), SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(timeout)
    }, [searchTerm, committedSearch, commitSearch])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        commitSearch(searchTerm.trim())
    }

    return (
        <div className="sticky top-20 z-30 -mx-3 mb-6 border-b border-border bg-background/85 px-3 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un produit..."
                            className="h-11 rounded-full pl-10 pr-10"
                            aria-label="Rechercher"
                            aria-busy={isPending}
                            autoComplete="off"
                            enterKeyHint="search"
                        />
                        {isPending ? (
                            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                        ) : (
                            searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm("")
                                        commitSearch("")
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    aria-label="Effacer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )
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
