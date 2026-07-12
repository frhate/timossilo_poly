import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Smartphone } from "lucide-react"

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

export default function BrandsSection({ brands }: BrandsSectionProps) {
  const getBrandUrl = (brand: Brand) =>
    brand.slug ? `/products?brand=${brand.slug}` : `/products?brand=${encodeURIComponent(brand.name)}`

  if (brands.length === 0) {
    return (
      <section className="relative w-full bg-gradient-to-b from-secondary/30 to-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <Smartphone className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40 md:h-16 md:w-16" />
          <p className="text-base font-medium text-muted-foreground md:text-lg">
            Aucune marque disponible pour le moment
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-secondary/30 to-background py-16 md:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Smartphone className="h-4 w-4" />
            Smartphones premium
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Achetez par{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              marque
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Trouvez votre smartphone idéal parmi les plus grandes marques mondiales.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands.map((brand) => (
            <Link key={brand.id} href={getBrandUrl(brand)} className="group block">
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-muted/40 to-muted/10 p-8">
                  {brand.image_url ? (
                    <Image
                      src={brand.image_url}
                      alt={brand.name}
                      fill
                      className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  ) : (
                    <Smartphone className="h-16 w-16 text-primary/30 transition-colors group-hover:text-primary/50" />
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow backdrop-blur-sm">
                    {brand.product_count || 0} {(brand.product_count || 0) === 1 ? "produit" : "produits"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-foreground md:text-xl">{brand.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Découvrez tous les modèles disponibles
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                    Voir les modèles
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center md:mt-16">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            Voir tous les smartphones
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}