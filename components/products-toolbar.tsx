"use client"

import {useCallback, useEffect, useMemo, useState, useTransition} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import {Loader2, Search, SlidersHorizontal, X} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import SortSelect from "@/components/sort-select"

interface ProductsToolbarProps {
    resultCount: number
}

const SEARCH_DEBOUNCE_MS = 300

const prettify = (value: string) =>
    value
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^\p{L}/u, (character) => character.toUpperCase())

export default function ProductsToolbar({resultCount}: ProductsToolbarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const committedSearch = searchParams.get("search") ?? ""
    const [searchTerm, setSearchTerm] = useState(committedSearch)

    const activeFilters = useMemo(() => {
        const filters: { key: string; label: string }[] = []
        const search = searchParams.get("search")
        const category = searchParams.get("category")
        const brand = searchParams.get("brand")

        if (search) filters.push({key: "search", label: `« ${search} »`})
        if (category) filters.push({key: "category", label: prettify(category)})
        if (brand) filters.push({key: "brand", label: prettify(brand)})

        return filters
    }, [searchParams])

    const openFilters = () => {
        window.dispatchEvent(new CustomEvent("toggleMobileSidebar"))
    }

    const applyParams = useCallback(
        (mutate: (params: URLSearchParams) => void) => {
            const params = new URLSearchParams(searchParams.toString())
            mutate(params)
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

    const commitSearch = useCallback(
        (term: string) => {
            applyParams((params) => {
                if (term) params.set("search", term)
                else params.delete("search")
            })
        },
        [applyParams],
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

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault()
        commitSearch(searchTerm.trim())
    }

    const clearFilter = (key: string) => {
        applyParams((params) => params.delete(key))
        if (key === "search") setSearchTerm("")
    }

    const clearAllFilters = () => {
        applyParams((params) => {
            params.delete("search")
            params.delete("category")
            params.delete("brand")
        })
        setSearchTerm("")
    }

    return (
        <div className="sticky top-20 z-30 mb-5 rounded-2xl border border-border/60 bg-background/85 p-3 shadow-sm backdrop-blur-md sm:p-4">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Rechercher un produit…"
                            className="h-11 rounded-xl border-border/70 bg-card pl-10 pr-10 text-sm shadow-none"
                            aria-label="Rechercher un produit"
                            aria-busy={isPending}
                            autoComplete="off"
                            enterKeyHint="search"
                        />
                        {isPending ? (
                            <Loader2 className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"/>
                        ) : (
                            searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm("")
                                        commitSearch("")
                                    }}
                                    className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    aria-label="Effacer la recherche"
                                >
                                    <X className="size-3.5"/>
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
                        className="h-11 rounded-xl border-border/70 bg-card px-4 shadow-none lg:hidden"
                    >
                        <SlidersHorizontal className="size-4"/>
                        Filtres
                        {activeFilters.length > 0 && (
                            <span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                                {activeFilters.length}
                            </span>
                        )}
                    </Button>
                    <SortSelect/>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/50 pt-3">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold tabular-nums text-foreground">{resultCount}</span>{" "}
                    produit{resultCount !== 1 ? "s" : ""}
                </p>

                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                        {activeFilters.map((filter) => (
                            <button
                                key={filter.key}
                                type="button"
                                onClick={() => clearFilter(filter.key)}
                                className="group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
                            >
                                {filter.label}
                                <X className="size-3 text-muted-foreground transition-colors group-hover:text-foreground"/>
                                <span className="sr-only">Retirer le filtre {filter.label}</span>
                            </button>
                        ))}

                        {activeFilters.length > 1 && (
                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="text-xs font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                            >
                                Tout effacer
                            </button>
                        )}
                    </div>
                )}

                {isPending && (
                    <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Loader2 className="size-3 animate-spin"/>
                        Mise à jour…
                    </span>
                )}
            </div>
        </div>
    )
}
