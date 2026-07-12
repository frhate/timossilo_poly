"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/admin/stat-card"
import AdminCategories from "@/components/admin/admin-categories"
import AdminProducts from "@/components/admin/admin-products"
import AdminOrders from "@/components/admin/admin-orders"
import AdminBrands from "@/components/admin/admin-brands"
import { Briefcase } from "lucide-react"
import { Package, Tags, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react"
import { type Product, type Category, type Order } from "@/lib/types/admin"

interface AdminDashboardProps {
    initialCategories: Category[]
    initialProducts: Product[]
    initialOrders: Order[]
}

export default function AdminDashboard({
    initialCategories,
    initialProducts,
    initialOrders,
}: AdminDashboardProps) {
    const totalRevenue = initialOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const pendingOrders = initialOrders.filter((order) => order.status === "pending").length
    const lowStockProducts = initialProducts.filter((product) => product.stock < 10).length

    const stats = [
        { title: "Total produits", value: initialProducts.length, description: "produits enregistrés", icon: Package },
        { title: "Catégories", value: initialCategories.length, description: "catégories actives", icon: Tags },
        { title: "Commandes", value: initialOrders.length, description: `${pendingOrders} en attente`, icon: ShoppingBag },
        { title: "Revenu total", value: `${totalRevenue.toLocaleString("fr-FR")} DZD`, description: "de toutes les commandes", icon: TrendingUp },
    ]

    return (
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Tableau de bord
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Gérez les produits, catégories et commandes facilement
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        description={stat.description}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* Low stock alert */}
            {lowStockProducts > 0 && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        Alerte : {lowStockProducts} produit(s) en faible stock (moins de 10 unités)
                    </p>
                </div>
            )}

            {/* Tabs */}
            <Card className="mt-6 border-border shadow-sm">
                <Tabs defaultValue="products" className="w-full">
                    <div className="overflow-x-auto px-2 pt-2">
                        <TabsList className="flex h-auto w-max min-w-full gap-1 bg-muted/50 p-1">
                            <TabsTrigger
                                value="products"
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
                            >
                                <Package className="h-4 w-4" />
                                <span>Produits</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="categories"
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
                            >
                                <Tags className="h-4 w-4" />
                                <span>Catégories</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="brands"
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
                            >
                                <Briefcase className="h-4 w-4" />
                                <span>Marques</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="orders"
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span>Commandes</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-3 sm:p-5">
                        <TabsContent value="products" className="mt-0">
                            <AdminProducts />
                        </TabsContent>
                        <TabsContent value="categories" className="mt-0">
                            <AdminCategories initialCategories={initialCategories} />
                        </TabsContent>
                        <TabsContent value="brands" className="mt-0">
                            <AdminBrands />
                        </TabsContent>
                        <TabsContent value="orders" className="mt-0">
                            <AdminOrders initialOrders={initialOrders} />
                        </TabsContent>
                    </div>
                </Tabs>
            </Card>
        </div>
    )
}