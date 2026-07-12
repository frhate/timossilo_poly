"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
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
    PanelLeftClose,
    PanelLeftOpen,
    Check,
    Receipt,
    Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
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

function getCategoryIcon(category: Category) {
    const slug = category.slug.toLowerCase()
    const name = category.name.toLowerCase()

    for (const [key, Icon] of Object.entries(categoryIcons)) {
        if (slug.includes(key) || name.includes(key)) {
            return Icon
        }
    }

    return LayoutGrid
}

/* ---------- Shared item renderers ---------- */

function AllProductsItem({
    isActive,
    onItemClick,
    collapsed = false,
}: {
    isActive: boolean
    onItemClick?: () => void
    collapsed?: boolean
}) {
    if (collapsed) {
        return (
            <Link
                href="/products"
                onClick={onItemClick}
                title="Tous les produits"
                className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl transition-all group",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
            >
                <LayoutGrid className="h-5 w-5" />
            </Link>
        )
    }

    return (
        <Link
            href="/products"
            onClick={onItemClick}
            className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <span
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}
            >
                <LayoutGrid className="h-4 w-4" />
            </span>
            <span className="truncate">Tous les produits</span>
            {isActive && <Check className="ml-auto h-4 w-4 text-primary" />}
        </Link>
    )
}

function CategoryItem({
    category,
    isActive,
    onItemClick,
    collapsed = false,
}: {
    category: Category
    isActive: boolean
    onItemClick?: () => void
    collapsed?: boolean
}) {
    const Icon = getCategoryIcon(category)

    if (collapsed) {
        return (
            <Link
                href={`/products?category=${category.slug}`}
                onClick={onItemClick}
                title={category.name}
                className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl transition-all group",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
            >
                <Icon className="h-5 w-5" />
            </Link>
        )
    }

    return (
        <Link
            href={`/products?category=${category.slug}`}
            onClick={onItemClick}
            className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <span
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}
            >
                <Icon className="h-4 w-4" />
            </span>
            <span className="truncate">{category.name}</span>
            {isActive && <Check className="ml-auto h-4 w-4 text-primary" />}
        </Link>
    )
}

/* ---------- Main component ---------- */

export default function CategoriesSidebar({ categories }: CategoriesSidebarProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const activeCategory = searchParams.get("category")
    const activeBrand = searchParams.get("brand")
    const isAllActive = pathname === "/products" && !activeCategory && !activeBrand

    useEffect(() => {
        const handleToggle = () => setMobileOpen((prev) => !prev)
        window.addEventListener("toggleMobileSidebar", handleToggle)
        return () => window.removeEventListener("toggleMobileSidebar", handleToggle)
    }, [])

    return (
        <>
            {/* Mobile Sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="flex w-[85%] max-w-sm flex-col p-0">
                    <SheetHeader className="border-b border-border p-5">
                        <SheetTitle className="flex items-center gap-2 text-left">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <LayoutGrid className="h-5 w-5" />
                            </span>
                            Catégories
                        </SheetTitle>
                        <SheetDescription className="text-left">
                            Filtrez notre catalogue par catégorie
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 space-y-1 overflow-y-auto p-4">
                        <AllProductsItem isActive={isAllActive} onItemClick={() => setMobileOpen(false)} />
                        {categories.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                isActive={activeCategory === category.slug}
                                onItemClick={() => setMobileOpen(false)}
                            />
                        ))}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar - Collapsible card */}
            <aside
                className={cn(
                    "sticky top-24 z-20 hidden shrink-0 transition-all duration-300 lg:block",
                    isCollapsed ? "w-20" : "w-72"
                )}
            >
                <div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
                    {/* Header */}
                    <div
                        className={cn(
                            "mb-4 flex items-center",
                            isCollapsed ? "justify-center" : "justify-between"
                        )}
                    >
                        {!isCollapsed && (
                            <div>
                                <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <LayoutGrid className="h-5 w-5 text-primary" />
                                    Catégories
                                </h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {categories.length} catégories
                                </p>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed((prev) => !prev)}
                            className="h-9 w-9 shrink-0 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            aria-label={isCollapsed ? "Déplier" : "Réduire"}
                        >
                            {isCollapsed ? (
                                <PanelLeftOpen className="h-5 w-5" />
                            ) : (
                                <PanelLeftClose className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav
                        className={cn(
                            "space-y-1",
                            isCollapsed && "flex flex-col items-center"
                        )}
                    >
                        <AllProductsItem isActive={isAllActive} collapsed={isCollapsed} />
                        {categories.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                isActive={activeCategory === category.slug}
                                collapsed={isCollapsed}
                            />
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    )
}

