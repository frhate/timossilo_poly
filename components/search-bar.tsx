"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function SearchBar() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "")

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
        <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Rechercher des produits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-full pl-9"
                />
            </div>
            <Button type="submit" className="rounded-full">
                Rechercher
            </Button>
        </form>
    )
}
