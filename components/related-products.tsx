// components/related-products.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface RelatedProduct {
  id: string
  name: string
  price: number
  image_urls: string[]
  stock: number
  categories: { name: string }
}

interface RelatedProductsProps {
  currentProductId: string
  brandId: string | null
  brandName: string | null
  categoryId: string
}

export default function RelatedProducts({
  currentProductId,
  brandId,
  brandName,
  categoryId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(value) + " د.ج"

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true)
      let query = supabase
        .from("products")
        .select("id, name, price, image_urls, stock, categories(name)")
        .neq("id", currentProductId)
        .limit(12)

      if (brandId) {
        query = query.eq("brand_id", brandId)
      } else {
        query = query.eq("category_id", categoryId)
      }

      const { data } = await query
      setProducts((data as RelatedProduct[]) || [])
      setLoading(false)
    }

    fetchRelated()
  }, [currentProductId, brandId, categoryId])

  const checkScrollability = () => {
    const el = sliderRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    checkScrollability()
    el.addEventListener("scroll", checkScrollability)
    window.addEventListener("resize", checkScrollability)
    return () => {
      el.removeEventListener("scroll", checkScrollability)
      window.removeEventListener("resize", checkScrollability)
    }
  }, [products])

  const scroll = (direction: "left" | "right") => {
    const el = sliderRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.75
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" })
  }

  if (!loading && products.length === 0) return null

  return (
    <section className="mt-16 mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {brandName ? (
                <>Autres produits{" "}
                  <span className="text-primary">{brandName}</span>
                </>
              ) : (
                "Produits similaires"
              )}
            </h2>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-2.5 rounded-full border-2 border-border hover:border-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Défiler à gauche"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-2.5 rounded-full border-2 border-border hover:border-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Défiler à droite"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Left Fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none rounded-l-xl" />
        )}
        {/* Right Fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none rounded-r-xl" />
        )}

        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-3 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-52 sm:w-56">
                  <Card className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-5 w-2/3 mt-2" />
                    </div>
                  </Card>
                </div>
              ))
            : products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="flex-shrink-0 w-52 sm:w-56 group"
                >
                  <Card className="overflow-hidden border hover:border-primary hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                      <Image
                        src={p.image_urls?.[0] ?? "/placeholder.svg"}
                        alt={p.name}
                        fill
                        sizes="224px"
                        className="object-cover  transition-transform duration-500 group-hover:scale-105"
                      />
                      {p.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Badge variant="destructive" className="text-xs font-semibold">
                            Rupture de stock
                          </Badge>
                        </div>
                      )}{p.stock > 0 && p.stock <= 5 && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                            Plus que {p.stock}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1 gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Tag className="w-3 h-3" />
                        <span className="truncate">{p.categories?.name}</span>
                      </div>

                      <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug flex-1">
                        {p.name}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/60">
                        <span className="text-base font-bold text-primary">
                          {formatPrice(p.price)}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            p.stock > 0
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {p.stock > 0 ? "En stock" : "Épuisé"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}