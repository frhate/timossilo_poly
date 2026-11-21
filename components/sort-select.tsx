"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ArrowUpDown } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const OPTIONS = [
    { value: "newest", label: "Plus récents" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "name-asc", label: "Nom (A → Z)" },
]

export default function SortSelect() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const current = searchParams.get("sort") ?? "newest"

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "newest") params.delete("sort")
        else params.set("sort", value)
        params.delete("page")
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Select value={current} onValueChange={handleChange}>
            <SelectTrigger
                className="h-11 w-full rounded-xl border-border/70 bg-card shadow-none sm:w-[190px]"
                aria-label="Trier les produits"
            >
                <ArrowUpDown className="size-4 text-muted-foreground" />
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

