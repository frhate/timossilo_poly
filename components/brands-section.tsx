"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Smartphone } from "lucide-react"
import { useEffect, useState } from "react"

interface Brand {
  id: string
  name: string
  slug: string | null
  image_url: string | null
  product_count?: number
}

interface BrandsSectionProps {
  brands: Brand[]
}

const BRAND_COLORS: Record<string, string> = {
  Apple: "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
  Samsung: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
  Xiaomi: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
  Huawei: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
  Oppo: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
  Vivo: "from-blue-50 to-purple-100 dark:from-blue-950 dark:to-purple-900",
  OnePlus: "from-red-50 to-gray-100 dark:from-red-950 dark:to-gray-900",
  Realme: "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
  Nokia: "from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900",
  Google: "from-red-50 via-blue-50 to-green-50 dark:from-red-950 dark:via-blue-950 dark:to-green-950",
  Sony: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
  Motorola: "from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900",
  Lenovo: "from-red-50 to-gray-100 dark:from-red-950 dark:to-gray-900",
}

export default function BrandsSection({ brands }: BrandsSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const getBrandColor = (brandName: string) =>
    BRAND_COLORS[brandName] || "from-primary/5 to-accent/5"

  const getBrandUrl = (brand: Brand) =>
    brand.slug ? `/products?brand=${brand.slug}` : `/products?brand=${encodeURIComponent(brand.name)}`

  if (brands.length === 0) {
    return (
      <section className="relative w-full bg-gradient-to-b from-background to-secondary/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 md:py-24">
            <Smartphone className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground text-base md:text-lg font-medium">
              Aucune marque disponible pour le moment
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full bg-gradient-to-b from-background to-secondary/10 py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-12 md:mb-20 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-transparent border border-primary/20 rounded-full mb-4 md:mb-6 hover:bg-primary/15 transition-colors">
            <Smartphone className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-semibold text-primary">Smartphones Premium</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-4 md:mb-6">
            Achat Smartphone
            <span className="block bg-primary    bg-clip-text text-transparent">
              par Marque
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Trouvez votre smartphone idéal parmi les plus grandes marques mondiales
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {brands.map((brand, index) => (
            <Link
              key={brand.id}
              href={getBrandUrl(brand)}
              className="block"
            >
              <div
                className={`group h-full rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 border border-border ${
                  hoveredIndex === index ? 'ring-2 ring-primary shadow-2xl shadow-primary/30' : 'hover:shadow-xl'
                } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: isLoaded ? `${index * 50}ms` : '0ms' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Brand Image */}
                <div className={`relative h-36 sm:h-40 md:h-48 flex items-center justify-center bg-gradient-to-br ${getBrandColor(brand.name)} overflow-hidden`}>
                  {brand.image_url ? (
                    <div className="relative w-full h-full p-6 md:p-8 flex items-center justify-center">
                      <Image
                        src={brand.image_url}
                        alt={brand.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500 p-6 md:p-8"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <Smartphone className="w-16 h-16 md:w-20 md:h-20 text-primary/30 group-hover:text-primary/50 transition-colors duration-300" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Product count badge */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 px-2 py-1 md:px-3 md:py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full shadow-lg">
                    {brand.product_count || 0} {(brand.product_count || 0) === 1 ? 'produit' : 'produits'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 bg-card">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-1 md:mb-2">
                    {brand.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 mb-3 md:mb-4">
                    Découvrez tous les modèles disponibles
                  </p>

                  <div className="inline-flex items-center gap-2 text-foreground font-semibold text-xs md:text-sm opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all duration-300">
                    Voir les modèles
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 font-semibold rounded-full shadow-lg text-sm md:text-base"
          >
            Voir Tous Les Smartphones
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}