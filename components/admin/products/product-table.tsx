// components/admin/products/product-table.tsx
       "use client"

       import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
       import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
       import { ProductRow } from "./product-row"
       import { type Product } from "@/lib/types/admin"
       import { Package } from "lucide-react"

       interface ProductTableProps {
         products: Product[]
         onDelete: (id: string) => Promise<void>
       }

       export function ProductTable({ products, onDelete }: ProductTableProps) {
         if (products.length === 0) {
           return (
             <Card>
               <CardHeader>
                 <CardTitle>Produits</CardTitle>
                 <CardDescription>Aucun produit pour le moment</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="flex flex-col items-center justify-center py-12 text-center">
                   <Package className="h-12 w-12 text-muted-foreground mb-4" />
                   <p className="text-muted-foreground">Commencez par ajouter un nouveau produit</p>
                 </div>
               </CardContent>
             </Card>
           )
         }

         const countText = `${products.length} produit${products.length === 1 ? "" : "s"}`

         return (
           <Card>
             <CardHeader>
               <CardTitle>Produits</CardTitle>
               <CardDescription>Gérer tous les produits de la boutique ({countText})</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="overflow-x-auto">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead className="text-right">Image</TableHead>
                       <TableHead className="text-right">Nom</TableHead>
                       <TableHead className="text-right">Prix</TableHead>
                       <TableHead className="text-right">Stock</TableHead>
                       <TableHead className="text-right">Catégorie</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {products.map((product) => (
                       <ProductRow key={product.id} product={product} onDelete={onDelete} />
                     ))}
                   </TableBody>
                 </Table>
               </div>
             </CardContent>
           </Card>
         )
       }