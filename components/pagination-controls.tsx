"use client"

import {Fragment, useEffect, useState} from "react"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import {cn} from "@/lib/utils"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    /** Plain query params so URLs can be rebuilt on the client. */
    searchParams: Record<string, string | undefined>
}

/**
 * How many pages to show on each side of the current page.
 * Wider screens have room for more links, so the control adapts instead of
 * staying stuck at the same tiny range.
 */
function getSiblingCount(width: number) {
    if (width >= 1536) return 4
    if (width >= 1280) return 3
    if (width >= 1024) return 2
    return 1
}

export default function PaginationControls({
    currentPage,
    totalPages,
    searchParams,
}: PaginationControlsProps) {
    // Matches the server-rendered markup, then expands after mount on larger screens.
    const [siblingCount, setSiblingCount] = useState(1)

    useEffect(() => {
        const update = () => setSiblingCount(getSiblingCount(window.innerWidth))

        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    const buildPageUrl = (page: number) => {
        const query = new URLSearchParams()

        if (searchParams.category) query.append("category", searchParams.category)
        if (searchParams.search) query.append("search", searchParams.search)
        if (searchParams.brand) query.append("brand", searchParams.brand)
        if (searchParams.sort) query.append("sort", searchParams.sort)
        query.append("page", page.toString())

        return `/products?${query.toString()}`
    }

    const visiblePages = Array.from({length: totalPages}, (_, index) => index + 1).filter(
        (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= siblingCount,
    )

    const hasPrevious = currentPage > 1
    const hasNext = currentPage < totalPages

    const mobileLinkClass =
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border/70 px-3 text-sm font-medium text-foreground transition-colors"
    const mobileDisabledClass =
        "border-border/40 text-muted-foreground/50 pointer-events-none select-none"

    return (
        <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground">
                Page{" "}
                <span className="font-semibold tabular-nums text-foreground">{currentPage}</span>{" "}
                sur <span className="tabular-nums">{totalPages}</span>
            </p>

            {/* Mobile: simple previous / next, so it never wraps or overflows. */}
            <nav
                aria-label="Pagination"
                className="flex w-full max-w-sm items-center justify-between gap-2 sm:hidden"
            >
                {hasPrevious ? (
                    <a
                        href={buildPageUrl(currentPage - 1)}
                        aria-label="Page précédente"
                        className={mobileLinkClass}
                    >
                        <ChevronLeft className="size-4"/>
                        Précédent
                    </a>
                ) : (
                    <span aria-disabled="true" className={cn(mobileLinkClass, mobileDisabledClass)}>
                        <ChevronLeft className="size-4"/>
                        Précédent
                    </span>
                )}

                <span className="shrink-0 px-1 text-sm font-semibold tabular-nums text-foreground">
                    {currentPage}
                    <span className="mx-1 font-normal text-muted-foreground">/</span>
                    {totalPages}
                </span>

                {hasNext ? (
                    <a
                        href={buildPageUrl(currentPage + 1)}
                        aria-label="Page suivante"
                        className={mobileLinkClass}
                    >
                        Suivant
                        <ChevronRight className="size-4"/>
                    </a>
                ) : (
                    <span aria-disabled="true" className={cn(mobileLinkClass, mobileDisabledClass)}>
                        Suivant
                        <ChevronRight className="size-4"/>
                    </span>
                )}
            </nav>

            {/* Tablet and up: numbered pages with adaptive range. */}
            <div className="hidden w-full sm:block">
                <Pagination>
                    <PaginationContent className="flex-wrap justify-center gap-1 sm:gap-1.5">
                    {hasPrevious && (
                        <PaginationItem>
                            <PaginationLink
                                href={buildPageUrl(currentPage - 1)}
                                size="default"
                                aria-label="Page précédente"
                                className="h-9 gap-1 rounded-full px-3 text-sm sm:h-10 sm:px-4"
                            >
                                <ChevronLeft className="size-4"/>
                                <span className="hidden md:inline">Précédent</span>
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    {visiblePages.map((page, index) => {
                        const previousPage = visiblePages[index - 1]
                        const showEllipsis = previousPage !== undefined && page - previousPage > 1

                        return (
                            <Fragment key={page}>
                                {showEllipsis && (
                                    <PaginationItem>
                                        <PaginationEllipsis className="size-9 sm:size-10"/>
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationLink
                                        href={buildPageUrl(page)}
                                        size="icon"
                                        isActive={page === currentPage}
                                        aria-label={`Page ${page}`}
                                        className={cn(
                                            "size-9 rounded-full text-sm tabular-nums sm:size-10",
                                            page === currentPage &&
                                            "border-primary/60 bg-primary/10 font-semibold text-foreground hover:bg-primary/15",
                                        )}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            </Fragment>
                        )
                    })}

                    {hasNext && (
                        <PaginationItem>
                            <PaginationLink
                                href={buildPageUrl(currentPage + 1)}
                                size="default"
                                aria-label="Page suivante"
                                className="h-9 gap-1 rounded-full px-3 text-sm sm:h-10 sm:px-4"
                            >
                                <span className="hidden md:inline">Suivant</span>
                                <ChevronRight className="size-4"/>
                            </PaginationLink>
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
        </div>
    )
}
