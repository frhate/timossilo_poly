"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Product } from "@/lib/types/admin"
import { Trash2, ImageIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProductRowProps {
  product: Product
  onDelete: (id: string) => Promise<void>
}

export function ProductRow({ product, onDelete }: ProductRowProps) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-16 w-16 object-cover rounded-md"
          />
        ) : (
          <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </td>
      <td className="p-3">
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </td>
      <td className="p-3 font-medium">{product.price.toLocaleString('ar-DZ')} دج</td>
      <td className="p-3">
        <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
          {product.stock > 0 ? `${product.stock} قطعة` : "نفذ المخزون"}
        </Badge>
      </td>
      <td className="p-3 text-sm text-muted-foreground">
        {product.categories?.name || "—"}
      </td>
      <td className="p-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف المنتج "{product.name}" بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(product.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  )
}

