"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryItem } from "./category-item"
import { type Category } from "@/lib/types/admin"
import { FolderOpen } from "lucide-react"

interface CategoryListProps {
  categories: Category[]
  onDelete: (id: string) => Promise<void>
}

export function CategoryList({ categories, onDelete }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>التصنيفات</CardTitle>
          <CardDescription>لا توجد تصنيفات حالياً</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">ابدأ بإضافة تصنيف جديد</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>التصنيفات</CardTitle>
        <CardDescription>إدارة تصنيفات المنتجات ({categories.length} تصنيف)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} onDelete={onDelete} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

