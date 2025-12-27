"use client"

    import ProductCard from "@/components/product-card"

    interface Product {
      id: string
      name: string
      price: number
      image_urls: string []
      stock: number
    }

    export default function ProductGrid({ products }: { products: Product[] }) {
      if (products.length === 0) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucun produit disponible</p>
          </div>
        )
      }

      return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )
    }