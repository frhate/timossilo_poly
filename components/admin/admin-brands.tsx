"use client"

import {createClient} from "@/lib/supabase/client"
import {useState, useEffect} from "react"
import {BrandForm} from "./brands/brand-form"
import {BrandTable} from "./brands/brand-table"
import {type Brands} from "@/lib/types/admin"
import {useToast} from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 10

export default function AdminBrands() {
    const [brands, setBrands] = useState<Brands[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()
    const {toast} = useToast()

    useEffect(() => {
        const fetchBrands = async () => {
            setIsLoading(true)
            try {
                const {data, error} = await supabase
                    .from("brands")
                    .select("*")
                    .order("created_at", {ascending: false})

                if (error) throw error
                setBrands(data || [])
            } catch (error) {
                console.error("Error fetching brands:", error)
                toast({
                    title: "Erreur",
                    description: "Échec du chargement des marques",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchBrands()
    }, [supabase, toast])

    const totalPages = Math.ceil(brands.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentBrands = brands.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleAddBrand = async (brand: Omit<Brands, 'id' | 'created_at'>) => {
        try {
            const {data, error} = await supabase
                .from("brands")
                .insert({
                    name: brand.name,
                    slug: brand.name.toLowerCase().replace(/\s+/g, '-'),
                    image_url: brand.image_url || null,
                })
                .select()
                .single()

            if (error) throw error

            setBrands([data, ...brands])
            setCurrentPage(1)

            toast({
                title: "Succès",
                description: "Marque ajoutée avec succès",
            })
        } catch (error: any) {
            console.error("Error adding brand:", error)
            toast({
                title: "Erreur",
                description: error?.message || "Échec de l'ajout de la marque",
                variant: "destructive",
            })
            throw error
        }
    }

    const handleDeleteBrand = async (id: string) => {
        try {
            const {error} = await supabase
                .from("brands")
                .delete()
                .eq("id", id)

            if (error) throw error

            setBrands(brands.filter((b) => b.id !== id))

            if (currentBrands.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1)
            }

            toast({
                title: "Succès",
                description: "Marque supprimée avec succès",
            })
        } catch (error) {
            console.error("Error deleting brand:", error)
            toast({
                title: "Erreur",
                description: "Échec de la suppression de la marque",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <div className="text-center py-8">Chargement...</div>
    }

    return (
        <div className="space-y-6">
            <BrandForm onSubmit={handleAddBrand}/>
            <BrandTable
                brands={currentBrands}
                onDelete={handleDeleteBrand}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}