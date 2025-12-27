"use client"

import {TableCell, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Trash2} from "lucide-react"
import {type Brands} from "@/lib/types/admin"
import {useState} from "react"
import Image from "next/image"

interface BrandRowProps {
    brand: Brands
    onDelete: (id: string) => Promise<void>
}

export function BrandRow({brand, onDelete}: BrandRowProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette marque ?")) {
            setIsLoading(true)
            try {
                await onDelete(brand.id)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <TableRow>
            <TableCell className="text-right">
                {brand.image_url ? (
                    <div className="relative w-10 h-10 inline-block">
                        <Image
                            src={brand.image_url}
                            alt={brand.name}
                            fill
                            className="object-contain rounded"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-muted rounded inline-flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">N/A</span>
                    </div>
                )}
            </TableCell>
            <TableCell className="text-right font-medium">{brand.name}</TableCell>
            <TableCell className="text-right">
                {new Date(brand.created_at).toLocaleDateString('fr-FR')}
            </TableCell>
            <TableCell className="text-right">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={isLoading}
                >
                    <Trash2 className="h-4 w-4"/>
                </Button>
            </TableCell>
        </TableRow>
    )
}