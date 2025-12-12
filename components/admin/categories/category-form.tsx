import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {type Category} from "@/lib/types/admin"
import {useState} from "react"
import {Loader2} from "lucide-react"

interface CategoryFormProps {
    onSubmit: (category: Pick<Category, 'name' | 'slug'>) => Promise<void>
}

export function CategoryForm({onSubmit}: CategoryFormProps) {
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await onSubmit({name, slug})

            setName("")
            setSlug("")
        } catch (error) {
            console.error("Error submitting category:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleNameChange = (value: string) => {
        setName(value)
        if (!slug) {
            setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ajouter une nouvelle catégorie</CardTitle>
                <CardDescription>Ajoutez une nouvelle catégorie pour organiser les produits</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom (EN)</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Electronics"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="electronics"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Il sera utilisé dans l'URL : /products?category={slug}
                        </p>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Ajouter la catégorie
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}