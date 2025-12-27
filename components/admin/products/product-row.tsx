"use client"

import {TableCell, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Trash2, Check, X, Edit} from "lucide-react"
import {type Product} from "@/lib/types/admin"
import {useState} from "react"
import Image from "next/image"

interface ProductRowProps {
    product: Product
    onDelete: (id: string) => Promise<void>
    onUpdateStock: (id: string, newStock: number) => Promise<void>
}

export function ProductRow({product, onDelete, onUpdateStock}: ProductRowProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedStock, setEditedStock] = useState(product.stock.toString())
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        const newStock = parseInt(editedStock)
        if (isNaN(newStock) || newStock < 0) return

        setIsLoading(true)
        try {
            await onUpdateStock(product.id, newStock)
            setIsEditing(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setEditedStock(product.stock.toString())
        setIsEditing(false)
    }

    const handleDelete = async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            setIsLoading(true)
            try {
                await onDelete(product.id)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <TableRow>
            <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                    {product.image_urls?.slice(0, 3).map((url, index) => (
                        <div key={index} className="relative w-10 h-10">
                            <Image
                                src={url}
                                alt={`${product.name} ${index + 1}`}
                                fill
                                className="object-cover rounded"
                            />
                        </div>
                    ))}
                </div>
            </TableCell>
            <TableCell className="text-right font-medium">{product.name}</TableCell>
            <TableCell className="text-right">{product.price.toLocaleString()} DZD</TableCell>
            <TableCell className="text-right">
                {isEditing ? (
                    <Input
                        type="number"
                        min="0"
                        value={editedStock}
                        onChange={(e) => setEditedStock(e.target.value)}
                        className="w-20 text-right"
                        disabled={isLoading}
                    />
                ) : (
                    product.stock
                )}
            </TableCell>
            <TableCell className="text-right">
                {product.categories?.name || "N/A"}
            </TableCell>
            <TableCell className="text-right">
                {product.brands?.name || "N/A"}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                <Check className="h-4 w-4"/>
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4"/>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsEditing(true)}
                                disabled={isLoading}
                            >
                                <Edit className="h-4 w-4"/>
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}