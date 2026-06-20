export default function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Timossilo Polymobile",
    url: "https://timossilo-polymobile.com",
    description:
      "Boutique en ligne de smartphones, ordinateurs et accessoires électroniques en Algérie",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://timossilo-polymobile.com/products?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
