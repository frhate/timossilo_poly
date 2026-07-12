"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "./image-upload"
import { type Product, type Category, type Brands } from "@/lib/types/admin"
import { Loader2, Save, Trash2, GripVertical, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductEditorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: Product | null
    categories: Category[]
    brands: Brands[]
    onSave: (id: string, updates: Partial<Product>) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export function ProductEditorDialog({
    open,
    onOpenChange,
    product,
    categories,
    brands,
    onSave,
    onDelete,
}: ProductEditorDialogProps) {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [brandId, setBrandId] = useState("")
    const [description, setDescription] = useState("")
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        if (product && open) {
            setName(product.name || "")
            setPrice(product.price?.toString() || "")
            setStock(product.stock?.toString() || "")
            setCategoryId(product.category_id || "")
            setBrandId(product.brand_id || "")
            setDescription(product.description || "")
            setImageUrls(product.image_urls || [])
            setConfirmDelete(false)
        }
    }, [product, open])

    const handleSave = async () => {
        if (!product) return
        const parsedPrice = parseFloat(price)
        const parsedStock = parseInt(stock)
        if (isNaN(parsedPrice) || parsedPrice < 0 || isNaN(parsedStock) || parsedStock < 0) {
            return
        }
        setIsSaving(true)
        try {
            await onSave(product.id, {
                name: name.trim(),
                price: parsedPrice,
                stock: parsedStock,
                category_id: categoryId,
                brand_id: brandId,
                description: description.trim() || undefined,
                image_urls: imageUrls,
            })
            onOpenChange(false)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!product) return
        setIsDeleting(true)
        try {
            await onDelete(product.id)
            onOpenChange(false)
        } finally {
            setIsDeleting(false)
        }
    }

    const moveImage = (index: number, direction: "up" | "down") => {
        const newUrls = [...imageUrls]
        const target = direction === "up" ? index - 1 : index + 1
        if (target < 0 || target >= newUrls.length) return
        ;[newUrls[index], newUrls[target]] = [newUrls[target], newUrls[index]]
        setImageUrls(newUrls)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Modifier le produit</DialogTitle>
                    <DialogDescription>
                        Modifiez tous les détails et les images du produit.
                    </DialogDescription>
                </DialogHeader>

                {product && (
                    <div className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nom du produit</Label>
                            <Input
                                id="edit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="iPhone 15 Pro"
                            />
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Prix (DZD)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-stock">Stock</Label>
                                <Input
                                    id="edit-stock"
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Category & Brand */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Catégorie</Label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger id="edit-category">
                                        <SelectValue placeholder="Choisir une catégorie" />
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
                                <Label htmlFor="edit-brand">Marque</Label>
                                <Select value={brandId} onValueChange={setBrandId}>
                                    <SelectTrigger id="edit-brand">
                                        <SelectValue placeholder="Choisir une marque" />
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

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Décrivez les caractéristiques du produit..."
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        {/* Images */}
                        <div className="space-y-2">
                            <Label>Images du produit</Label>
                            <ImageUpload
                                onImagesUpdated={setImageUrls}
                                currentImageUrls={imageUrls}
                                productId={product.id}
                            />
                            {imageUrls.length > 1 && (
                                <p className="text-xs text-muted-foreground">
                                    Réorganisez pour définir l&apos;image principale (en premier).
                                </p>
                            )}
                            {imageUrls.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {imageUrls.map((url, index) => (
                                        <div
                                            key={url}
                                            className="flex items-center gap-3 rounded-lg border border-border bg-card p-2"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={url}
                                                alt={`Image ${index + 1}`}
                                                className="h-12 w-12 rounded-md object-cover"
                                            />
                                            <span className="flex-1 truncate text-sm text-muted-foreground">
                                                {index === 0 ? "Image principale" : `Image ${index + 1}`}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => moveImage(index, "up")}
                                                    disabled={index === 0}
                                                >
                                                    <GripVertical className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        setImageUrls(imageUrls.filter((_, i) => i !== index))
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {confirmDelete ? (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Confirmer la suppression ?</span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                                Oui
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setConfirmDelete(false)}
                            >
                                Non
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 sm:mr-auto"
                            onClick={() => setConfirmDelete(true)}
                            disabled={isSaving}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </Button>
                    )}

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                            Annuler
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

