"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {useState, useEffect} from "react"
import {
    Smartphone,
    Laptop,
    Headphones,
    Watch,
    Camera,
    Tv,
    Speaker,
    Keyboard,
    Mouse,
    HardDrive,
    Gamepad2,
    Tablet,
    Monitor,
    Usb,
    Battery,
    WifiIcon,
    LayoutGrid,
    X,
    Receipt,
    Target
} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

interface Category {
    id: string
    name: string
    slug: string
    image_url?: string
}

interface CategoriesSidebarProps {
    categories: Category[]
}

// Map category slugs to icons
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    smartphones: Smartphone,
    phone: Smartphone,
    telephone: Smartphone,
    laptop: Laptop,
    ordinateur: Laptop,
    computers: Laptop,
    headphones: Headphones,
    ecouteurs: Headphones,
    audio: Headphones,
    watches: Watch,
    montres: Watch,
    smartwatch: Watch,
    cameras: Camera,
    photo: Camera,
    televisions: Tv,
    tv: Tv,
    television: Tv,
    speakers: Speaker,
    occasions: Target,
    keyboards: Keyboard,
    claviers: Keyboard,
    mouse: Mouse,
    souris: Mouse,
    storage: HardDrive,
    stockage: HardDrive,
    gaming: Gamepad2,
    affaire_du_jour: Receipt,
    tablets: Tablet,
    tablettes: Tablet,
    monitors: Monitor,
    ecrans: Monitor,
    accessories: Usb,
    accessoires: Usb,
    batteries: Battery,
    batterie: Battery,
    networking: WifiIcon,
    reseau: WifiIcon,
}

// Get icon for category based on slug or name
function getCategoryIcon(category: Category) {
    const slug = category.slug.toLowerCase()
    const name = category.name.toLowerCase()

    // Try to match by slug first
    for (const [key, Icon] of Object.entries(categoryIcons)) {
        if (slug.includes(key) || name.includes(key)) {
            return Icon
        }
    }

    // Default icon
    return LayoutGrid
}

// Shared navigation content component
function CategoriesNav({categories, pathname, onItemClick}: {
    categories: Category[],
    pathname: string,
    onItemClick?: () => void
}) {
    return (
        <nav className="space-y-1">
            {/* All Products Link */}
            <Link
                href="/products"
                onClick={onItemClick}
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-primary/10 hover:text-primary group",
                    pathname === "/products" && !pathname.includes("category")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                )}
            >
                <LayoutGrid className="w-4 h-4 flex-shrink-0"/>
                <span className="truncate">Tous les produits</span>
            </Link>

            {/* Category Links */}
            {categories.map((category) => {
                const Icon = getCategoryIcon(category)
                const isActive = pathname.includes(`category=${category.slug}`)

                return (
                    <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            "hover:bg-primary/10 hover:text-primary group",
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        <Icon className={cn(
                            "w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110",
                            isActive && "text-primary"
                        )}/>
                        <span className="truncate">{category.name}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

export default function CategoriesSidebar({categories}: CategoriesSidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    // Listen for toggle event from navigation
    useEffect(() => {
        const handleToggle = () => {
            setMobileOpen(prev => !prev)
        }

        window.addEventListener('toggleMobileSidebar', handleToggle)
        return () => window.removeEventListener('toggleMobileSidebar', handleToggle)
    }, [])

    return (
        <>
            {/* Mobile Sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <SheetHeader className="p-6 pb-4">
                        <SheetTitle className="flex items-center gap-2 text-left">
                            <LayoutGrid className="w-5 h-5 text-primary"/>
                            Catégories
                        </SheetTitle>
                        <p className="text-xs text-muted-foreground text-left">
                            Parcourir par catégorie
                        </p>
                    </SheetHeader>
                    <div className="px-6 pb-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                        <CategoriesNav
                            categories={categories}
                            pathname={pathname}
                            onItemClick={() => setMobileOpen(false)}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar - Collapsible */}
            <aside
                className={cn(
                    "hidden lg:block border-r border-border bg-card/50 backdrop-blur-sm sticky top-0 h-screen overflow-y-auto transition-all duration-300",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className="p-4">
                    {/* Toggle Button */}
                    <div className={cn("mb-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                        {!isCollapsed && (
                            <div>
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                                    <LayoutGrid className="w-5 h-5 text-primary"/>
                                    Catégories
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Parcourir par catégorie
                                </p>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hover:bg-primary/10"
                        >
                            {isCollapsed ? (
                                <LayoutGrid className="w-5 h-5 text-primary"/>
                            ) : (
                                <X className="w-5 h-5"/>
                            )}
                        </Button>
                    </div>

                    {/* Navigation */}
                    {isCollapsed ? (
                        <nav className="space-y-2 flex flex-col items-center">
                            {/* All Products Icon */}
                            <Link
                                href="/products"
                                className={cn(
                                    "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 group",
                                    "hover:bg-primary/10 hover:text-primary",
                                    pathname === "/products" && !pathname.includes("category")
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground"
                                )}
                                title="Tous les produits"
                            >
                                <LayoutGrid className="w-5 h-5 transition-transform group-hover:scale-110"/>
                            </Link>

                            {/* Category Icons */}
                            {categories.map((category) => {
                                const Icon = getCategoryIcon(category)
                                const isActive = pathname.includes(`category=${category.slug}`)

                                return (
                                    <Link
                                        key={category.id}
                                        href={`/products?category=${category.slug}`}
                                        className={cn(
                                            "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 group",
                                            "hover:bg-primary/10 hover:text-primary",
                                            isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                                        )}
                                        title={category.name}
                                    >
                                        <Icon className={cn(
                                            "w-5 h-5 transition-transform group-hover:scale-110",
                                            isActive && "text-primary"
                                        )}/>
                                    </Link>
                                )
                            })}
                        </nav>
                    ) : (
                        <CategoriesNav categories={categories} pathname={pathname}/>
                    )}
                </div>
            </aside>
        </>
    )
}

