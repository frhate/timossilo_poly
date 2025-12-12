import {createClient} from "@/lib/supabase/client"
import {useState} from "react"
import {CategoryForm} from "./categories/category-form"
import {CategoryList} from "./categories/category-list"
import {type Category} from "@/lib/types/admin"
import {useToast} from "@/hooks/use-toast"

interface AdminCategoriesProps {
    initialCategories: Category[]
}

export default function AdminCategories({initialCategories}: AdminCategoriesProps) {
    const [categories, setCategories] = useState(initialCategories)
    const supabase = createClient()
    const {toast} = useToast()

    const handleAddCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
        try {
            const {data, error} = await supabase
                .from("categories")
                .insert({
                    name: category.name,
                    slug: category.slug,
                })
                .select()
                .single()

            // If Supabase returned an error object, normalize and throw a readable Error
            if (error) {
                const message = (error as any)?.message ?? JSON.stringify(error)
                console.error("Supabase insert error details:", error)
                throw new Error(message)
            }

            if (!data) {
                // Guard against unexpected empty responses
                console.error("Insert returned no data:", {category})
                throw new Error("Insert failed: no data returned")
            }

            setCategories([data, ...categories])

            toast({
                title: "Succès",
                description: "Catégorie ajoutée avec succès",
            })
        } catch (err) {
            const e = err as any
            // Log useful diagnostic fields for debugging in the console
            console.error("Error adding category:", e, {
                message: e?.message,
                stack: e?.stack,
                details: e?.details,
                hint: e?.hint,
                code: e?.code,
            })

            toast({
                title: "Erreur",
                description: e?.message ?? "Échec lors de l'ajout de la catégorie",
                variant: "destructive",
            })
        }
    }

    const handleDeleteCategory = async (id: string) => {
        try {
            const {error} = await supabase.from("categories").delete().eq("id", id)

            if (error) throw error

            setCategories(categories.filter((c) => c.id !== id))

            toast({
                title: "Succès",
                description: "Catégorie supprimée avec succès",
            })
        } catch (error) {
            console.error("Error deleting category:", error)
            toast({
                title: "Erreur",
                description: "Échec lors de la suppression de la catégorie",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <CategoryForm onSubmit={handleAddCategory}/>
            <CategoryList categories={categories} onDelete={handleDeleteCategory}/>
        </div>
    )
}