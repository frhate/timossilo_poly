"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {ImageUpload} from "./image-upload"
import {type Product, type Category, Brands} from "@/lib/types/admin"
import {useState} from "react"
import {Loader2} from "lucide-react"
import {Textarea} from "@/components/ui/textarea"

interface ProductFormProps {
    categories: Category[]
    brands: Brands[]
    onSubmit: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>
}
export function ProductForm({categories, brands, onSubmit}: ProductFormProps) {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [brandId, setBrandId] = useState("")
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (imageUrls.length === 0) {
            setError("Veuillez télécharger au moins une image du produit")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            await onSubmit({
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                category_id: categoryId,
                brand_id: brandId,
                image_urls: imageUrls,
                description: description.trim() || undefined,
            })

            // Reset form
            setName("")
            setPrice("")
            setStock("")
            setCategoryId("")
            setBrandId("")
            setImageUrls([])
            setDescription("")
        } catch (error) {
            console.error("Error submitting product:", error)
            setError("Échec de l'ajout du produit")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ajouter un nouveau produit</CardTitle>
                <CardDescription>Ajoutez un nouveau produit à la boutique</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="product-name">Nom</Label>
                            <Input
                                id="product-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="iPhone 15 Pro"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Prix (DZD)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="150000"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="50"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez les caractéristiques du produit..."
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Catégorie</Label>
                            <Select value={categoryId} onValueChange={setCategoryId} required>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Choisir une catégorie"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brand">Marque</Label>
                            <Select value={brandId} onValueChange={setBrandId} required>
                                <SelectTrigger id="brand">
                                    <SelectValue placeholder="Choisir une marque"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <ImageUpload onImagesUpdated={setImageUrls} currentImageUrls={imageUrls}/>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" disabled={isSubmitting || imageUrls.length === 0}
                            className="w-full md:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Ajouter le produit
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}