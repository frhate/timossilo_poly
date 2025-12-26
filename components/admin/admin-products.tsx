"use client"

import {createClient} from "@/lib/supabase/client"
import {useState, useEffect} from "react"
import {ProductForm} from "./products/product-form"
import {ProductTable} from "./products/product-table"
import {type Product, type Category} from "@/lib/types/admin"
import {useToast} from "@/hooks/use-toast"

interface AdminProductsProps {
    sellerId: string
}

const ITEMS_PER_PAGE = 10

export default function AdminProducts({sellerId}: AdminProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()
    const {toast} = useToast()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    supabase.from("categories").select("*"),
                    supabase
                        .from("products")
                        .select("*, categories(name)")
                        .eq("seller_id", sellerId)
                        .order("created_at", {ascending: false})
                ])

                setCategories(categoriesRes.data || [])
                setProducts(productsRes.data || [])
            } catch (error) {
                console.error("Error fetching data:", error)
                toast({
                    title: "Erreur",
                    description: "Échec du chargement des données",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [supabase, sellerId, toast])

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentProducts = products.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleUpdateStock = async (id: string, newStock: number) => {
        try {
            const {error} = await supabase
                .from("products")
                .update({stock: newStock})
                .eq("id", id)
                .eq("seller_id", sellerId)

            if (error) throw error

            setProducts(products.map(p =>
                p.id === id ? {...p, stock: newStock} : p
            ))

            toast({
                title: "Succès",
                description: "Stock mis à jour avec succès",
            })
        } catch (error) {
            console.error("Error updating stock:", error)
            toast({
                title: "Erreur",
                description: "Échec de la mise à jour du stock",
                variant: "destructive",
            })
        }
    }

    const handleAddProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
        try {
            const {data, error} = await supabase
                .from("products")
                .insert({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    category_id: product.category_id,
                    image_url: product.image_url || null,
                    description: product.description || null,
                    seller_id: sellerId,
                })
                .select("*, categories(name)")
                .single()

            if (error) {
                console.error("Supabase error details:", error)
                throw error
            }

            setProducts([data, ...products])
            setCurrentPage(1)

            toast({
                title: "Succès",
                description: "Produit ajouté avec succès",
            })
        } catch (error: any) {
            console.error("Full error object:", error)
            toast({
                title: "Erreur",
                description: error?.message || "Échec de l'ajout du produit",
                variant: "destructive",
            })
            throw error
        }
    }

    const handleDeleteProduct = async (id: string) => {
        try {
            const {error} = await supabase
                .from("products")
                .delete()
                .eq("id", id)
                .eq("seller_id", sellerId)

            if (error) throw error

            setProducts(products.filter((p) => p.id !== id))

            if (currentProducts.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1)
            }

            toast({
                title: "Succès",
                description: "Produit supprimé avec succès",
            })
        } catch (error) {
            console.error("Error deleting product:", error)
            toast({
                title: "Erreur",
                description: "Échec de la suppression du produit",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <div className="text-center py-8">Chargement...</div>
    }

    return (
        <div className="space-y-6">
            <ProductForm categories={categories} onSubmit={handleAddProduct}/>
            <ProductTable
                products={currentProducts}
                onDelete={handleDeleteProduct}
                onUpdateStock={handleUpdateStock}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}