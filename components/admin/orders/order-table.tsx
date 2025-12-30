"use client"

                    import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
                    import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table"
                    import {OrderRow} from "./order-row"
                    import {type Order, type OrderStatus} from "@/lib/types/admin"
                    import {Package} from "lucide-react"

                    interface OrderTableProps {
                        orders: Order[]
                        onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>
                        onViewDetails: (order: Order) => void
                    }

                    export function OrderTable({orders, onStatusChange, onViewDetails}: OrderTableProps) {
                        if (orders.length === 0) {
                            return (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Commandes</CardTitle>
                                        <CardDescription>Aucune commande pour le moment</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Package className="h-12 w-12 text-muted-foreground mb-4"/>
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
                                                {orders.map((order) => (
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
                                </CardContent>
                            </Card>
                        )
                    }