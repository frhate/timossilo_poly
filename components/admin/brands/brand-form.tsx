"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {type Brands} from "@/lib/types/admin"
import {useState} from "react"
import {Loader2} from "lucide-react"

interface BrandFormProps {
    onSubmit: (brand: Omit<Brands, 'id' | 'created_at'>) => Promise<void>
}

export function BrandForm({onSubmit}: BrandFormProps) {
    const [name, setName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            await onSubmit({
                name,
                image_url: imageUrl.trim() || undefined,
            })

            setName("")
            setImageUrl("")
        } catch (error) {
            console.error("Error submitting brand:", error)
            setError("Échec de l'ajout de la marque")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ajouter une nouvelle marque</CardTitle>
                <CardDescription>Ajoutez une nouvelle marque de produits</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="brand-name">Nom de la marque</Label>
                        <Input
                            id="brand-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Apple, Samsung, etc."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="brand-image">URL de l'image (optionnel)</Label>
                        <Input
                            id="brand-image"
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/logo.png"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Ajouter la marque
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}