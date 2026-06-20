interface ProductSchemaProps {
  product: {
    id: string
    name: string
    description?: string | null
    price: number
    stock: number
    image_urls?: string[] | null
    slug?: string | null
    categories?: { name: string } | null
    brands?: { name: string } | null
  }
  url: string
}

export default function ProductSchema({ product, url }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : undefined,
    brand: product.brands?.name
      ? {
          "@type": "Brand",
          name: product.brands.name,
        }
      : undefined,
    category: product.categories?.name || undefined,
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "DZD",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Timossilo Polymobile",
      },
    },
    url: url,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

