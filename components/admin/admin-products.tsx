"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { ProductForm } from "./products/product-form"
import { ProductCard } from "./products/product-card"
import { ProductEditorDialog } from "./products/product-editor-dialog"
import { type Product, type Category, type Brands } from "@/lib/types/admin"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, Search, Loader2, PackageOpen } from "lucide-react"

const ITEMS_PER_PAGE = 12

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brands[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [addOpen, setAddOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [editorOpen, setEditorOpen] = useState(false)
    const supabase = createClient()
    const { toast } = useToast()

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
                        .order("created_at", { ascending: false }),
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

    const filteredProducts = products.filter((product) => {
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

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    const handleAddProduct = async (product: Omit<Product, "id" | "created_at">) => {
        try {
            const { data, error } = await supabase
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

            if (error) throw error

            setProducts([data, ...products])
            setAddOpen(false)
            setCurrentPage(1)

            toast({ title: "Succès", description: "Produit ajouté avec succès" })
        } catch (error: any) {
            console.error("Error adding product:", error)
            toast({
                title: "Erreur",
                description: error?.message || "Échec de l'ajout du produit",
                variant: "destructive",
            })
            throw error
        }
    }

    const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            const { error } = await supabase.from("products").update(updates).eq("id", id)
            if (error) throw error

            setProducts(products.map((p) => (p.id === id ? { ...p, ...updates } : p)))
            toast({ title: "Succès", description: "Produit mis à jour avec succès" })
        } catch (error) {
            console.error("Error updating product:", error)
            toast({
                title: "Erreur",
                description: "Échec de la mise à jour du produit",
                variant: "destructive",
            })
            throw error
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return
        try {
            const { error } = await supabase.from("products").delete().eq("id", id)
            if (error) throw error

            setProducts(products.filter((p) => p.id !== id))
            toast({ title: "Succès", description: "Produit supprimé avec succès" })
        } catch (error) {
            console.error("Error deleting product:", error)
            toast({
                title: "Erreur",
                description: "Échec de la suppression du produit",
                variant: "destructive",
            })
        }
    }

    const openEditor = (product: Product) => {
        setEditingProduct(product)
        setEditorOpen(true)
    }

    return (
        <div className="space-y-5">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher par nom, catégorie ou marque..."
                        className="rounded-full pl-9"
                    />
                </div>
                <Button onClick={() => setAddOpen(true)} className="rounded-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un produit
                </Button>
            </div>

            {searchQuery && (
                <p className="text-sm text-muted-foreground">
                    {filteredProducts.length} produit(s) trouvé(s)
                </p>
            )}

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Chargement...
                </div>
            ) : currentProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-16 text-center">
                    <PackageOpen className="h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm text-muted-foreground">
                        Aucun produit trouvé
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {currentProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={openEditor}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} sur {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Précédent
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Suivant
                        </Button>
                    </div>
                </div>
            )}

            {/* Add Product Dialog */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Ajouter un produit</DialogTitle>
                        <DialogDescription>Ajoutez un nouveau produit à la boutique</DialogDescription>
                    </DialogHeader>
                    <ProductForm categories={categories} brands={brands} onSubmit={handleAddProduct} />
                </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <ProductEditorDialog
                open={editorOpen}
                onOpenChange={setEditorOpen}
                product={editingProduct}
                categories={categories}
                brands={brands}
                onSave={handleUpdateProduct}
                onDelete={handleDeleteProduct}
            />
        </div>
    )
}