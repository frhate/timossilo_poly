"use client"

import {createClient} from "@/lib/supabase/client"
import {useState, useEffect} from "react"
import {ProductForm} from "./products/product-form"
import {ProductTable} from "./products/product-table"
import {type Product, type Category, type Brands} from "@/lib/types/admin"
import {useToast} from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 10

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brands[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()
    const {toast} = useToast()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const [categoriesRes, brandsRes, productsRes] = await Promise.all([
                    supabase.from("categories").select("*").order("name"),
                    supabase.from("brands").select("*").order("name"),
                    supabase
                        .from("products")
                        .select("*, categories(name), brands(name)")
                        .order("created_at", {ascending: false})
                ])

                setCategories(categoriesRes.data || [])
                setBrands(brandsRes.data || [])
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
    }, [supabase, toast])

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentProducts = products.slice(startIndex, endIndex)

    // Filter products based on search query
    const filteredProducts = products.filter(product => {
        const searchLower = searchQuery.toLowerCase()
        const productName = product.name?.toLowerCase() || ""
        const categoryName = (product.categories as any)?.name?.toLowerCase() || ""
        const brandName = (product.brands as any)?.name?.toLowerCase() || ""

        return (
            productName.includes(searchLower) ||
            categoryName.includes(searchLower) ||
            brandName.includes(searchLower)
        )
    })

    const filteredTotalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    const filteredStartIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const filteredEndIndex = filteredStartIndex + ITEMS_PER_PAGE
    const filteredCurrentProducts = filteredProducts.slice(filteredStartIndex, filteredEndIndex)

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleUpdateStock = async (id: string, newStock: number) => {
        try {
            const {error} = await supabase
                .from("products")
                .update({stock: newStock})
                .eq("id", id)

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
                    brand_id: product.brand_id,
                    image_urls: product.image_urls,
                    description: product.description || null,
                })
                .select("*, categories(name), brands(name)")
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


    const handleUpdateProduct = async (id: string, updates: Partial<Pick<Product, 'price' | 'description'>>) => {
        try {
            const {error} = await supabase
                .from("products")
                .update(updates)
                .eq("id", id)

            if (error) throw error

            setProducts(products.map(p =>
                p.id === id ? {...p, ...updates} : p
            ))

            toast({
                title: "Succès",
                description: "Produit mis à jour avec succès",
            })
        } catch (error) {
            console.error("Error updating product:", error)
            toast({
                title: "Erreur",
                description: "Échec de la mise à jour du produit",
                variant: "destructive",
            })
        }
    }

    const handleDeleteProduct = async (id: string) => {
        try {
            const {error} = await supabase
                .from("products")
                .delete()
                .eq("id", id)

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
            <ProductForm categories={categories} brands={brands} onSubmit={handleAddProduct}/>

            {/* Search Bar */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Rechercher un produit par nom, catégorie ou marque..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />

            </div>

            {/* Search Results Info */}
            {searchQuery && (
                <div className="text-sm text-gray-600">
                    {filteredProducts.length} produit(s) trouvé(s)
                </div>
            )}

            <ProductTable
                products={filteredCurrentProducts}
                onDelete={handleDeleteProduct}
                onUpdateStock={handleUpdateStock}
                onUpdateProduct={handleUpdateProduct}
                currentPage={currentPage}
                totalPages={filteredTotalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}