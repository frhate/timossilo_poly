"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/admin/stat-card"
import AdminCategories from "@/components/admin/admin-categories"
import AdminProducts from "@/components/admin/admin-products"
import AdminOrders from "@/components/admin/admin-orders"
import AdminBrands from "@/components/admin/admin-brands"
import { Briefcase, Eye, Flame, Star } from "lucide-react"
import { Package, Tags, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react"
import { type Product, type Category, type Order } from "@/lib/types/admin"

interface AdminDashboardProps {
    initialCategories: Category[]
    initialProducts: Product[]
    initialOrders: Order[]
}

type InsightProduct = Product & {
    visitor_count: number
    sold_count: number
    revenue: number
    conversion_rate: number
}

export default function AdminDashboard({
    initialCategories,
    initialProducts,
    initialOrders,
}: AdminDashboardProps) {
    const totalRevenue = initialOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const pendingOrders = initialOrders.filter((order) => order.status === "pending").length
    const lowStockProducts = initialProducts.filter((product) => product.stock < 10).length

    const salesByProduct = new Map<string, { sold_count: number; revenue: number }>()
    initialOrders.forEach((order) => {
        order.order_items.forEach((item) => {
            const current = salesByProduct.get(item.product_id) || { sold_count: 0, revenue: 0 }
            salesByProduct.set(item.product_id, {
                sold_count: current.sold_count + item.quantity,
                revenue: current.revenue + item.quantity * item.price,
            })
        })
    })

    const enrichedProducts: InsightProduct[] = initialProducts
        .map((product) => {
            const sales = salesByProduct.get(product.id) || { sold_count: 0, revenue: 0 }
            const visitor_count = product.visitor_count ?? 0
            const sold_count = sales.sold_count
            return {
                ...product,
                visitor_count,
                sold_count,
                revenue: sales.revenue,
                conversion_rate: visitor_count > 0 ? Math.round((sold_count / visitor_count) * 100) : 0,
            }
        })
        .sort((a, b) => b.visitor_count - a.visitor_count)

    const topViewedProducts = enrichedProducts.slice(0, 5)
    const topSellingProducts = [...enrichedProducts].sort((a, b) => b.sold_count - a.sold_count).slice(0, 5)
    const averageConversion = enrichedProducts.length
        ? Math.round(enrichedProducts.reduce((sum, product) => sum + product.conversion_rate, 0) / enrichedProducts.length)
        : 0

    const stats = [
        { title: "Total produits", value: initialProducts.length, description: "produits enregistrés", icon: Package },
        { title: "Catégories", value: initialCategories.length, description: "catégories actives", icon: Tags },
        { title: "Commandes", value: initialOrders.length, description: `${pendingOrders} en attente`, icon: ShoppingBag },
        { title: "Revenu total", value: `${totalRevenue.toLocaleString("fr-FR")} DZD`, description: "de toutes les commandes", icon: TrendingUp },
        { title: "Vues produits", value: enrichedProducts.reduce((sum, product) => sum + product.visitor_count, 0), description: "visites cumulées", icon: Eye },
        { title: "Top conversion", value: `${averageConversion}%`, description: "taux moyen visite → vente", icon: Star },
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

            {/* Product insights */}
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <Card className="p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        <h2 className="text-base font-semibold">Produits les plus vus</h2>
                    </div>
                    <div className="space-y-3">
                        {topViewedProducts.length > 0 ? (
                            topViewedProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                                    <div>
                                        <p className="font-medium">{index + 1}. {product.name}</p>
                                        <p className="text-muted-foreground">{product.categories?.name || "Sans catégorie"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{product.visitor_count}</p>
                                        <p className="text-xs text-muted-foreground">vues</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Aucune vue enregistrée pour le moment.</p>
                        )}
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <Flame className="h-4 w-4 text-primary" />
                        <h2 className="text-base font-semibold">Produits les plus vendus</h2>
                    </div>
                    <div className="space-y-3">
                        {topSellingProducts.length > 0 ? (
                            topSellingProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                                    <div>
                                        <p className="font-medium">{index + 1}. {product.name}</p>
                                        <p className="text-muted-foreground">
                                            {product.sold_count} vendus · conversion {product.conversion_rate}%
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{product.revenue.toLocaleString("fr-FR")} DZD</p>
                                        <p className="text-xs text-muted-foreground">revenu</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Aucune vente enregistrée pour le moment.</p>
                        )}
                    </div>
                </Card>
            </div>

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