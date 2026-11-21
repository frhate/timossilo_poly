"use client"

import Link from "next/link"
import {ChevronRight} from "lucide-react"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

export default function Breadcrumb({items}: BreadcrumbProps) {
    return (
        <nav aria-label="Fil d'Ariane" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
                <li>
                    <Link href="/" className="rounded px-0.5 transition-colors hover:text-foreground">
                        Accueil
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex min-w-0 items-center gap-1.5">
                        <ChevronRight className="size-3.5 shrink-0 opacity-60"/>
                        {item.href ? (
                            <Link href={item.href} className="rounded px-0.5 transition-colors hover:text-foreground">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="max-w-[42ch] truncate font-medium text-foreground">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
