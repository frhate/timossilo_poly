"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card} from "@/components/ui/card"
import {StatCard} from "@/components/admin/stat-card"
import AdminCategories from "@/components/admin/admin-categories"
import AdminProducts from "@/components/admin/admin-products"
import AdminOrders from "@/components/admin/admin-orders"
import AdminBrands from "@/components/admin/admin-brands"
import {Briefcase} from "lucide-react";
import {Package, Tags, ShoppingBag, TrendingUp} from "lucide-react"
import {type Product, type Category, type Order} from "@/lib/types/admin"

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
    const pendingOrders = initialOrders.filter(order => order.status === 'pending').length
    const lowStockProducts = initialProducts.filter(product => product.stock < 10).length

    return (
        <div className="container px-4 py-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Tableau de bord administratif
                </h1>
                <p className="text-muted-foreground">
                    Gérez les produits, catégories et commandes facilement
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total produits"
                    value={initialProducts.length}
                    description="produits enregistrés"
                    icon={Package}
                />

                <StatCard
                    title="Catégories"
                    value={initialCategories.length}
                    description="catégories actives"
                    icon={Tags}
                />

                <StatCard
                    title="Commandes"
                    value={initialOrders.length}
                    description={`${pendingOrders} en attente`}
                    icon={ShoppingBag}
                />

                <StatCard
                    title="Revenu total"
                    value={`${totalRevenue.toLocaleString('fr-FR')} DZD`}
                    description="de toutes les commandes"
                    icon={TrendingUp}
                />
            </div>

            {lowStockProducts > 0 && (
                <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                    <div className="p-4">
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            ⚠️ Alerte : {lowStockProducts} produit(s) en faible stock (moins de 10 unités)
                        </p>
                    </div>
                </Card>
            )}

            <Card className="border border-border shadow-sm">
                <Tabs defaultValue="products" className="w-full">
                    <TabsList
                        className="w-full grid grid-cols-2 lg:grid-cols-4 bg-muted/50 p-1 h-auto rounded-t-lg gap-1">
                        <TabsTrigger
                            value="products"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2"
                        >
                            <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
                            <span className="hidden sm:inline">Produits</span>
                            <span className="sm:hidden">Prod.</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="categories"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2"
                        >
                            <Tags className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
                            <span className="hidden sm:inline">Catégories</span>
                            <span className="sm:hidden">Catég.</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="brands"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2"
                        >
                            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
                            <span className="hidden sm:inline">Marques</span>
                            <span className="sm:hidden">Marq.</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="orders"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2"
                        >
                            <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"/>
                            <span className="hidden sm:inline">Commandes</span>
                            <span className="sm:hidden">Cmd.</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="p-4 md:p-6">
                        <TabsContent value="products" className="mt-0">
                            <AdminProducts/>
                        </TabsContent>

                        <TabsContent value="categories" className="mt-0">
                            <AdminCategories initialCategories={initialCategories}/>
                        </TabsContent>

                        <TabsContent value="brands" className="mt-0">
                            <AdminBrands/>
                        </TabsContent>

                        <TabsContent value="orders" className="mt-0">
                            <AdminOrders initialOrders={initialOrders}/>
                        </TabsContent>
                    </div>
                </Tabs>
            </Card></div>
    )
}