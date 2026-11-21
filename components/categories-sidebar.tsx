"use client"

import Link from "next/link"
import {usePathname, useSearchParams} from "next/navigation"
import {useEffect, useState} from "react"
import {
    Battery,
    Camera,
    Check,
    Gamepad2,
    HardDrive,
    Headphones,
    Keyboard,
    Laptop,
    LayoutGrid,
    Monitor,
    Mouse,
    PanelLeftClose,
    PanelLeftOpen,
    Receipt,
    Smartphone,
    Speaker,
    Tablet,
    Target,
    Tv,
    Usb,
    Watch,
    WifiIcon,
} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
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

function NavItem({
    href,
    label,
    icon: Icon,
    isActive,
    collapsed = false,
    onItemClick,
}: {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    isActive: boolean
    collapsed?: boolean
    onItemClick?: () => void
}) {
    if (collapsed) {
        return (
            <Link
                href={href}
                onClick={onItemClick}
                title={label}
                aria-label={label}
                className={cn(
                    "flex size-11 items-center justify-center rounded-xl transition-colors",
                    isActive
                        ? "bg-primary/15 text-foreground ring-1 ring-primary/30"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
            >
                <Icon className="size-5"/>
            </Link>
        )
    }

    return (
        <Link
            href={href}
            onClick={onItemClick}
            className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActive
                    ? "bg-primary/15 font-semibold text-foreground"
                    : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
        >
            {isActive && (
                <span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                />
            )}
            <Icon
                className={cn(
                    "size-[18px] shrink-0 transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                )}
            />
            <span className="truncate">{label}</span>
            {isActive && <Check className="ml-auto size-4 shrink-0 text-foreground/70"/>}
        </Link>
    )
}

/* ---------- Main component ---------- */

export default function CategoriesSidebar({categories}: CategoriesSidebarProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const activeCategory = searchParams.get("category")
    const activeBrand = searchParams.get("brand")
    const isAllActive = pathname === "/products" && !activeCategory && !activeBrand

    useEffect(() => {
        const handleToggle = () => setMobileOpen((previous) => !previous)
        window.addEventListener("toggleMobileSidebar", handleToggle)
        return () => window.removeEventListener("toggleMobileSidebar", handleToggle)
    }, [])

    return (
        <>
            {/* Mobile Sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="flex w-[85%] max-w-sm flex-col p-0">
                    <SheetHeader className="border-b border-border/60 px-5 py-4">
                        <SheetTitle className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            <LayoutGrid className="size-4"/>
                            Catégories
                        </SheetTitle>
                        <SheetDescription className="text-left text-xs">
                            {categories.length} rayons disponibles
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-3">
                        <nav className="space-y-0.5">
                            <NavItem
                                href="/products"
                                label="Tous les produits"
                                icon={LayoutGrid}
                                isActive={isAllActive}
                                onItemClick={() => setMobileOpen(false)}
                            />
                            {categories.map((category) => (
                                <NavItem
                                    key={category.id}
                                    href={`/products?category=${category.slug}`}
                                    label={category.name}
                                    icon={getCategoryIcon(category)}
                                    isActive={activeCategory === category.slug}
                                    onItemClick={() => setMobileOpen(false)}
                                />
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "sticky top-24 z-20 hidden shrink-0 self-start transition-[width] duration-300 lg:block",
                    isCollapsed ? "w-[72px]" : "w-[264px]",
                )}
            >
                <div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-border/60 bg-card p-2.5 shadow-sm">
                    <div
                        className={cn(
                            "mb-2 flex items-center gap-1",
                            isCollapsed ? "justify-center" : "px-1.5 pt-1",
                        )}
                    >
                        {!isCollapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Catalogue
                                </p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                                    Catégories
                                </p>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed((previous) => !previous)}
                            className="size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={isCollapsed ? "Déplier les catégories" : "Réduire les catégories"}
                        >
                            {isCollapsed ? (
                                <PanelLeftOpen className="size-4"/>
                            ) : (
                                <PanelLeftClose className="size-4"/>
                            )}
                        </Button>
                    </div>

                    <nav className={cn("space-y-0.5", isCollapsed && "flex flex-col items-center gap-1 space-y-0")}>
                        <NavItem
                            href="/products"
                            label="Tous les produits"
                            icon={LayoutGrid}
                            isActive={isAllActive}
                            collapsed={isCollapsed}
                        />
                        {categories.map((category) => (
                            <NavItem
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                label={category.name}
                                icon={getCategoryIcon(category)}
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
