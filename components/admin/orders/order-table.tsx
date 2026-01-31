"use client"

                    import { useState, useMemo } from "react"
                    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
                    import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
                    import { OrderRow } from "./order-row"
                    import { type Order, type OrderStatus } from "@/lib/types/admin"
                    import { Package } from "lucide-react"
                    import {Pagination,
                      PaginationContent,
                      PaginationItem,
                      PaginationLink,
                      PaginationPrevious,
                      PaginationNext,
                      PaginationEllipsis,
                    } from "@/components/ui/pagination"

                    interface OrderTableProps {
                      orders: Order[]
                      onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>
                      onViewDetails: (order: Order) => void
                    }

                    const ITEMS_PER_PAGE = 10

                    export function OrderTable({ orders, onStatusChange, onViewDetails }: OrderTableProps) {
                      const [currentPage, setCurrentPage] = useState(1)

                      const { paginatedOrders, totalPages } = useMemo(() => {
                        const total = Math.ceil(orders.length / ITEMS_PER_PAGE)
                        const start = (currentPage - 1) * ITEMS_PER_PAGE
                        const end = start + ITEMS_PER_PAGE
                        return {
                          paginatedOrders: orders.slice(start, end),
                          totalPages: total,
                        }
                      }, [orders, currentPage])

                      const generatePageNumbers = () => {
                        const pages: (number | string)[] = []
                        const maxVisible = 5

                        if (totalPages <= maxVisible) {
                          return Array.from({ length: totalPages }, (_, i) => i + 1)
                        }

                        pages.push(1)
                        if (currentPage > 3) pages.push("...")
                        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                          if (pages[pages.length - 1] !== "...") pages.push(i)
                        }
                        if (currentPage < totalPages - 2) pages.push("...")
                        pages.push(totalPages)

                        return pages
                      }

                      if (orders.length === 0) {
                        return (
                          <Card>
                            <CardHeader>
                              <CardTitle>Commandes</CardTitle>
                              <CardDescription>Aucune commande pour le moment</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">Aucune commande enregistrée pour le moment</p>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      }

                      return (
                        <Card>
                          <CardHeader>
                            <CardTitle>Commandes</CardTitle>
                            <CardDescription>
                              Gérer et suivre toutes les commandes ({orders.length} commande{orders.length > 1 ? "s" : ""})
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-left">Numéro de commande</TableHead>
                                    <TableHead className="text-left">Téléphone</TableHead>
                                    <TableHead className="text-left">Montant</TableHead>
                                    <TableHead className="text-left">Statut</TableHead>
                                    <TableHead className="text-left">Date</TableHead>
                                    <TableHead className="text-left">Heure</TableHead>
                                    <TableHead className="text-left">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {paginatedOrders.map((order) => (
                                    <OrderRow
                                      key={order.id}
                                      order={order}
                                      onStatusChange={onStatusChange}
                                      onViewDetails={onViewDetails}
                                    />
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            {totalPages > 1 && (
                              <div className="mt-6">
                                <Pagination>
                                  <PaginationContent>
                                    <PaginationItem>
                                      <PaginationPrevious
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                      />
                                    </PaginationItem>

                                    {generatePageNumbers().map((page, index) =>
                                      page === "..." ? (
                                        <PaginationItem key={`ellipsis-${index}`}>
                                          <PaginationEllipsis />
                                        </PaginationItem>
                                      ) : (
                                        <PaginationItem key={page}>
                                          <PaginationLink
                                            onClick={() => setCurrentPage(page as number)}
                                            isActive={currentPage === page}
                                            className="cursor-pointer"
                                          >
                                            {page}
                                          </PaginationLink>
                                        </PaginationItem>
                                      )
                                    )}

                                    <PaginationItem>
                                      <PaginationNext
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                      />
                                    </PaginationItem>
                                  </PaginationContent>
                                </Pagination>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    }