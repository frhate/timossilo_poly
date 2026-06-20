import type { Metadata } from "next"

const SITE_URL = "https://timossilo-polymobile.com"
const SITE_NAME = "Timossilo Polymobile"
const DEFAULT_DESCRIPTION =
  "La meilleure boutique pour téléphones, ordinateurs et accessoires en Algérie - Timossilo"

interface PageMetadata {
  title: string
  description: string
  canonical: string
  openGraph?: Metadata["openGraph"]
}

export function getPageMetadata({
  title,
  description,
  path = "",
  openGraph,
}: {
  title?: string
  description?: string
  path?: string
  openGraph?: Metadata["openGraph"]
}): PageMetadata {
  const finalTitle = title
    ? title.length > 60
      ? title.slice(0, 57) + "..."
      : title
    : SITE_NAME
  const finalDescription =
    description && description.length > 160
      ? description.slice(0, 157) + "..."
      : description || DEFAULT_DESCRIPTION
  const canonical = path ? `${SITE_URL}${path}` : SITE_URL

  return {
    title: finalTitle,
    description: finalDescription,
    canonical,
    openGraph: openGraph || {
      type: "website",
      locale: "fr_DZ",
      url: canonical,
      title: finalTitle,
      description: finalDescription,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/logo.jpg`,
          width: 1200,
          height: 630,
          alt: "Timossilo - Boutique Électronique",
        },
      ],
    },
  }
}

export function getHomeMetadata(): Metadata {
  const meta = getPageMetadata({
    title: "Timossilo Polymobile | Smartphones & Ordinateurs en Algérie",
    description:
      "Achetez les derniers smartphones, ordinateurs et accessoires électroniques au meilleur prix en Algérie. Livraison rapide, paiement à la livraison. Samsung, iPhone, Xiaomi et plus.",
  })

  return {
    ...meta,
    alternates: {
      canonical: "/",
      languages: {
        "fr-dz": "/",
      },
    },
    openGraph: meta.openGraph,
  }
}

export function getProductsListingMetadata(params?: {
  brand?: string
  category?: string
  search?: string
}): Metadata {
  let title = "Tous les Produits | Timossilo Algérie"
  let description =
    "Découvrez notre large sélection de smartphones, ordinateurs et accessoires. Meilleurs prix en Algérie avec livraison à domicile."

  if (params?.brand) {
    title = `${capitalize(params.brand)} Smartphones | Achat en Ligne - Timossilo`
    description = `Achetez les derniers smartphones ${capitalize(params.brand)} au meilleur prix en Algérie. Livraison rapide et paiement à la livraison.`
  } else if (params?.category) {
    title = `${capitalize(params.category)} | Timossilo Algérie`
    description = `Découvrez notre sélection de ${params.category}. Prix compétitifs et livraison rapide en Algérie.`
  } else if (params?.search) {
    title = `Résultats pour "${params.search}" | Timossilo`
    description = `Résultats de recherche pour "${params.search}". Trouvez le smartphone ou accessoire parfait chez Timossilo.`
  }

  const meta = getPageMetadata({
    title,
    description,
    path: "/products",
  })

  return {
    ...meta,
    alternates: {
      canonical: "/products",
      languages: {
        "fr-dz": "/products",
      },
    },
    openGraph: meta.openGraph,
  }
}

export function getProductMetadata(product: {
  id: string
  name: string
  description?: string | null
  price: number
  stock: number
  image_urls?: string[] | null
  slug?: string | null
  categories?: { name: string; slug?: string | null } | null
  brands?: { name: string; slug?: string | null } | null
}): Metadata {
  const priceFormatted = new Intl.NumberFormat("fr-DZ", {
    maximumFractionDigits: 0,
  }).format(product.price)

  const title = `${product.name} - Prix ${priceFormatted} DA | Timossilo Algérie`
  const description =
    product.description && product.description.length > 20
      ? `${product.description.slice(0, 140)}... Achetez au prix ${priceFormatted} DA en Algérie.`
      : `Achetez ${product.name} au prix ${priceFormatted} DA en Algérie. ${product.stock > 0 ? "En stock" : "Rupture de stock"}. Livraison rapide.`

  const productPath = `/products/${product.slug || product.id}`
  const imageUrl =
    product.image_urls?.[0] || `${SITE_URL}/placeholder.jpg`

  const meta = getPageMetadata({
    title,
    description,
    path: productPath,
    openGraph: {
      type: "website",
      locale: "fr_DZ",
      url: `${SITE_URL}${productPath}`,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  })

  return {
    ...meta,
    alternates: {
      canonical: productPath,
      languages: {
        "fr-dz": productPath,
      },
    },
    openGraph: meta.openGraph,
  }
}

export function getBlogMetadata(): Metadata {
  const meta = getPageMetadata({
    title: "Guides Tech & Comparaisons | Timossilo Algérie",
    description:
      "Guides d'achat, comparatifs smartphones et articles tech par Timossilo. Découvrez les dernières tendances et faites le bon choix.",
    path: "/blog",
  })

  return {
    ...meta,
    alternates: {
      canonical: "/blog",
      languages: {
        "fr-dz": "/blog",
      },
    },
    openGraph: meta.openGraph,
  }
}

export function getCartMetadata(): Metadata {
  const meta = getPageMetadata({
    title: "Panier | Timossilo",
    description: "Consultez votre panier et passez votre commande chez Timossilo.",
    path: "/cart",
  })

  return {
    ...meta,
    alternates: {
      canonical: "/cart",
      languages: {
        "fr-dz": "/cart",
      },
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: meta.openGraph,
  }
}

export function getCheckoutMetadata(): Metadata {
  const meta = getPageMetadata({
    title: "Paiement | Timossilo",
    description: "Finalisez votre commande chez Timossilo. Paiement sécurisé et livraison rapide.",
    path: "/checkout",
  })

  return {
    ...meta,
    alternates: {
      canonical: "/checkout",
      languages: {
        "fr-dz": "/checkout",
      },
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: meta.openGraph,
  }
}

export function getAccountMetadata(): Metadata {
  const meta = getPageMetadata({
    title: "Mon Compte | Timossilo",
    description: "Gérez vos commandes et votre compte Timossilo.",
    path: "/account",
  })

  return {
    ...meta,
    alternates: {
      canonical: "/account",
      languages: {
        "fr-dz": "/account",
      },
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: meta.openGraph,
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
