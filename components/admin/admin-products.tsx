"use client"

import {createClient} from "@/lib/supabase/client"
import {useState, useEffect} from "react"
import {ProductForm} from "./products/product-form"
import {ProductTable} from "./products/product-table"
import {type Product, type Category} from "@/lib/types/admin"
import {useToast} from "@/hooks/use-toast"

interface AdminProductsProps {
    initialProducts: Product[]
}

export default function AdminProducts({initialProducts}: AdminProductsProps) {
    const [products, setProducts] = useState(initialProducts)
    const [categories, setCategories] = useState<Category[]>([])
    const supabase = createClient()
    const {toast} = useToast()

    useEffect(() => {
        const fetchCategories = async () => {
            const {data} = await supabase.from("categories").select("*")
            setCategories(data || [])
        }
        fetchCategories()
    }, [supabase])

    const handleAddProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
        try {
            const {data, error} = await supabase
                .from("products")
                .insert({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    category_id: product.category_id,
                    image_url: product.image_url,
                })
                .select("*, categories(name_ar, name)")
                .single()

            if (error) throw error

            setProducts([data, ...products])

            toast({
                title: "Succès",
                description: "Produit ajouté avec succès",
            })
        } catch (error) {
            console.error("Error adding product:", error)
            toast({
                title: "Erreur",
                description: "Échec de l'ajout du produit",
                variant: "destructive",
            })
            throw error
        }
    }

    const handleDeleteProduct = async (id: string) => {
        try {
            const {error} = await supabase.from("products").delete().eq("id", id)

            if (error) throw error

            setProducts(products.filter((p) => p.id !== id))

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

    return (
        <div className="space-y-6">
            <ProductForm categories={categories} onSubmit={handleAddProduct}/>
            <ProductTable products={products} onDelete={handleDeleteProduct}/>
        </div>
    )
}