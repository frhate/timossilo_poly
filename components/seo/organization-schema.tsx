export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Timossilo Polymobile",
    description:
      "Boutique de smartphones, ordinateurs et appareils électroniques en Algérie. Vente en ligne avec livraison à domicile.",
    url: "https://timossilo-polymobile.com",
    logo: "https://timossilo-polymobile.com/logo.jpg",
    image: "https://timossilo-polymobile.com/timossilo.jpg",
    telephone: "+213542304569",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Constantine",
      addressLocality: "Constantine",
      addressRegion: "Constantine",
      postalCode: "25000",
      addressCountry: "DZ",
    },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/timosilo.timosilo",
      "https://www.instagram.com/timossilo_polymobile",
      "https://www.tiktok.com/@timossilo.polymob",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

