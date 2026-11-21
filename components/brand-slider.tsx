"use client"

import Image from "next/image"
import Link from "next/link"
import {useSearchParams} from "next/navigation"
import {useEffect, useRef, useState} from "react"
import {ChevronLeft, ChevronRight, LayoutGrid} from "lucide-react"
import {cn} from "@/lib/utils"
import type {Brands} from "@/lib/types/admin"

interface BrandSliderProps {
    brands: Brands[]
    selectedBrand?: string
}

export default function BrandSlider({brands, selectedBrand}: BrandSliderProps) {
    const searchParams = useSearchParams()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("brand")
    params.delete("page")
    const query = params.toString()
    const allBrandsHref = query ? `/products?${query}` : "/products"

    const checkScroll = () => {
        const container = scrollContainerRef.current
        if (!container) return
        const {scrollLeft, scrollWidth, clientWidth} = container
        setCanScrollLeft(scrollLeft > 4)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4)
    }

    useEffect(() => {
        checkScroll()
        const container = scrollContainerRef.current
        if (!container) return

        const observer = new ResizeObserver(checkScroll)
        observer.observe(container)
        window.addEventListener("resize", checkScroll)

        return () => {
            observer.disconnect()
            window.removeEventListener("resize", checkScroll)
        }
    }, [brands])

    const scroll = (direction: "left" | "right") => {
        const container = scrollContainerRef.current
        if (!container) return
        container.scrollBy({
            left: direction === "left" ? -320 : 320,
            behavior: "smooth",
        })
    }

    return (
        <section className="mb-6 rounded-3xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Marques
                    </p>
                    <h2 className="mt-0.5 text-base font-semibold tracking-tight text-foreground sm:text-lg">
                        Parcourir par marque
                    </h2>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        aria-label="Défiler les marques vers la gauche"
                        className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                    >
                        <ChevronLeft className="size-4"/>
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        aria-label="Défiler les marques vers la droite"
                        className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                    >
                        <ChevronRight className="size-4"/>
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex snap-x gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3"
            >
                {selectedBrand && (
                    <Link
                        href={allBrandsHref}
                        className="group flex w-[72px] shrink-0 snap-start flex-col items-center gap-2 sm:w-20"
                    >
                        <span className="flex size-16 items-center justify-center rounded-2xl border border-dashed border-border bg-background text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-foreground sm:size-[72px]">
                            <LayoutGrid className="size-5"/>
                        </span>
                        <span className="max-w-full truncate text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                            Toutes
                        </span>
                    </Link>
                )}

                {brands.map((brand) => {
                    const isSelected = selectedBrand === brand.slug

                    return (
                        <Link
                            key={brand.id}
                            href={`/products?brand=${brand.slug}`}
                            className="group flex w-[72px] shrink-0 snap-start flex-col items-center gap-2 sm:w-20"
                            aria-current={isSelected ? "true" : undefined}
                        >
                            <span
                                className={cn(
                                    "relative flex size-16 items-center justify-center overflow-hidden rounded-2xl border bg-background transition-all sm:size-[72px]",
                                    isSelected
                                        ? "border-primary ring-2 ring-primary/25"
                                        : "border-border/60 group-hover:border-border group-hover:shadow-sm",
                                )}
                            >
                                {brand.image_url ? (
                                    <Image
                                        src={brand.image_url}
                                        alt={brand.name}
                                        fill
                                        sizes="72px"
                                        className="object-contain p-2.5"
                                    />
                                ) : (
                                    <span className="px-1 text-center text-[10px] font-semibold leading-tight text-muted-foreground">
                                        {brand.name}
                                    </span>
                                )}
                            </span>
                            <span
                                className={cn(
                                    "max-w-full truncate text-[11px] font-medium transition-colors",
                                    isSelected
                                        ? "font-semibold text-foreground"
                                        : "text-muted-foreground group-hover:text-foreground",
                                )}
                            >
                                {brand.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
