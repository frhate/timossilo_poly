"use client"

import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {BrandRow} from "./brand-row"
import {type Brands} from "@/lib/types/admin"
import {Button} from "@/components/ui/button"
import {ChevronLeft, ChevronRight} from "lucide-react"

interface BrandTableProps {
    brands: Brands[]
    onDelete: (id: string) => Promise<void>
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function BrandTable({
                               brands,
                               onDelete,
                               currentPage,
                               totalPages,
                               onPageChange
                           }: BrandTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Marques</CardTitle>
                <CardDescription>Gérez les marques de produits</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">Image</TableHead>
                                <TableHead className="text-right">Nom</TableHead>
                                <TableHead className="text-right">Date de création</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {brands.map((brand) => (
                                <BrandRow key={brand.id} brand={brand} onDelete={onDelete}/>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            Page {currentPage} sur {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4"/>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}