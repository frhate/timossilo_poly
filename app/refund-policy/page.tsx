import { Metadata } from "next";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";

const SITE_URL = "https://timossilo-polymobile.com";

export const metadata: Metadata = {
  title: "Politique de Remboursement - Timossilo Polymobile",
  description: "Politique de remboursement pour les téléphones en Algérie. Remboursement intégral sous 6 mois en cas de problème sur votre téléphone. Timossilo Polymobile - Votre confiance, notre priorité.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/refund-policy",
    languages: {
      "fr-DZ": "/refund-policy",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: `${SITE_URL}/refund-policy`,
    siteName: "Timossilo Polymobile",
    title: "Politique de Remboursement - Timossilo Polymobile",
    description: "Remboursement intégral sous 6 mois en cas de problème sur votre téléphone. Votre satisfaction est notre priorité.",
    images: [
      {
        url: `${SITE_URL}/logo.jpg`,
        width: 1200,
        height: 630,
        alt: "Timossilo Polymobile - Politique de Remboursement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Politique de Remboursement - Timossilo Polymobile",
    description: "Remboursement intégral sous 6 mois en cas de problème sur votre téléphone.",
    images: [`${SITE_URL}/logo.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyPage() {
  return (
    <>
      <Navigation />
      <BreadcrumbSchema
        items={[
          { name: "Accueil", url: SITE_URL },
          { name: "Politique de Remboursement", url: `${SITE_URL}/refund-policy` },
        ]}
      />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full w-fit mx-auto mb-6">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-green-700">Garantie Satisfaction 6 Mois</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                Politique de <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Remboursement</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Chez Timossilo Polymobile, votre satisfaction est notre priorité absolue.
                Si vous rencontrez un problème sur votre téléphone dans les <strong className="text-foreground">6 mois</strong> suivant votre achat,
                nous vous remboursons <strong className="text-green-600 font-bold">intégralement</strong>.
              </p>
            </section>

            {/* Key Benefits */}
            <section className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="bg-card border border-border/50 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Remboursement Intégral</h3>
                <p className="text-muted-foreground">100% de votre argent remboursé sans frais cachés ni frais de restockage</p>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Garantie 6 Mois</h3>
                <p className="text-muted-foreground">Couverture complète pendant 6 mois à compter de la date d'achat</p>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Processus Simple</h3>
                <p className="text-muted-foreground">Procédure simple et rapide, sans paperasse compliquée</p>
              </div>
            </section>

            {/* Policy Details */}
            <section className="space-y-12 mb-16">
              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Notre Engagement
                </h2>
                <div className="prose prose-lg max-w-none text-foreground">
                  <p className="mb-4 text-lg leading-relaxed">
                    Chez <strong className="text-foreground">Timossilo Polymobile</strong>, nous sommes fiers de la qualité de nos produits.
                    Chaque téléphone que nous vendons est rigoureusement testé et vérifié avant d'être mis en vente.
                    Cependant, nous comprenons que des problèmes peuvent survenir, c'est pourquoi nous offrons une
                    <strong className="text-green-600">garantie de remboursement intégral de 6 mois</strong> sur tous nos téléphones.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    Cette politique s'applique à <strong className="text-foreground">tous les téléphones</strong> achetés chez Timossilo Polymobile,
                    qu'il s'agisse de smartphones neufs ou reconditionnés, de toutes marques (Samsung, iPhone, Xiaomi, Oppo, etc.).
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Conditions de Remboursement
                </h2>
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <strong>Remboursement Intégral (100%)</strong>
                    </h3>
                    <p className="text-green-700 leading-relaxed">
                      Si votre téléphone présente un <strong>défaut de fabrication</strong>, un <strong>problème matériel</strong>
                      ou un <strong>dysfonctionnement logiciel</strong> non résoluble dans les <strong>6 mois</strong> suivant l'achat,
                      nous vous remboursons <strong>l'intégralité du montant payé</strong>, sans frais de restockage ni frais cachés.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Problèmes Couvrant la Garantie
                    </h3>
                    <ul className="space-y-3 pl-6">
                      {[
                        "Défauts d'écran (pixels morts, lignes, tactile défaillant)",
                        "Problèmes de batterie (gonflement, décharge anormale, ne charge plus)",
                        "Dysfonctionnements caméra (flou, ne s'ouvre pas, flash défaillant)",
                        "Problèmes audio (haut-parleur, micro, prise jack)",
                        "Problèmes de connectivité (WiFi, Bluetooth, 4G/5G, GPS)",
                        "Boutons défaillants (power, volume, empreinte digitale)",
                        "Surchauffe anormale en utilisation normale",
                        "Redémarrages intempestifs ou blocages système",
                        "Problèmes de charge (port USB, charge sans fil)",
                        "Défauts de fabrication sur le châssis/coque"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <strong>Conditions Importantes</strong>
                    </h3>
                    <ul className="space-y-2 text-amber-700 pl-6">
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Le téléphone ne doit pas avoir subi de <strong>dommages physiques</strong> (chute, choc, immersion, écran cassé)
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        La <strong>facture d'achat originale</strong> doit être présentée
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Le téléphone ne doit pas avoir été <strong>ouvert, réparé ou modifié</strong> par un tiers
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Les <strong>accessoires d'origine</strong> (chargeur, câble, écouteurs) doivent être retournés si possible
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Procédure de Remboursement
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Contactez-nous",
                      description: "Appelez-nous au <strong>+213 542 30 45 69</strong> ou envoyez un email à <strong>info@Timossilo.com</strong> en décrivant le problème rencontré.",
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )
                    },
                    {
                      step: "2",
                      title: "Diagnostic Rapide",
                      description: "Notre équipe technique effectuera un diagnostic rapide (souvent à distance via photos/vidéos) pour confirmer le problème.",
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )
                    },
                    {
                      step: "3",
                      title: "Retour du Produit",
                      description: "Si le problème est confirmé, nous organisons le retour du téléphone (frais de port à notre charge en Algérie).",
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      )
                    },
                    {
                      step: "4",
                      title: "Remboursement Immédiat",
                      description: "Dès réception et vérification du téléphone, le remboursement intégral est effectué sous <strong>48h maximum</strong> via le mode de paiement initial.",
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="text-2xl font-bold">{item.step}</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Questions Fréquentes
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      q: "Le remboursement s'applique-t-il aux téléphones reconditionnés ?",
                      a: "Oui, absolument ! Notre garantie de 6 mois s'applique à <strong>tous les téléphones</strong> vendus chez Timossilo Polymobile, qu'ils soient neufs ou reconditionnés. Chaque téléphone reconditionné est testé rigoureusement avant la vente."
                    },
                    {
                      q: "Que se passe-t-il si le problème apparaît après 6 mois ?",
                      a: "Au-delà de 6 mois, la garantie légale de conformité (2 ans en Algérie) s'applique toujours. Nous vous invitons à nous contacter pour évaluer la situation. Dans de nombreux cas, nous pouvons encore proposer une réparation ou un échange."
                    },
                    {
                      q: "Les frais de livraison pour le retour sont-ils à ma charge ?",
                      a: "<strong>Non.</strong> Si le problème est couvert par notre garantie 6 mois, <strong>nous prenons en charge les frais de retour</strong> partout en Algérie. Un coursier viendra récupérer le téléphone à votre domicile."
                    },
                    {
                      q: "Combien de temps prend le remboursement ?",
                      a: "Le remboursement est effectué sous <strong>48h maximum</strong> après réception et vérification du téléphone. Le montant est recrédité sur votre moyen de paiement initial (carte bancaire, virement, espèces)."
                    },
                    {
                      q: "Que faire si j'ai perdu ma facture ?",
                      a: "Pas de panique ! Nous conservons l'historique de tous nos achats. Contactez-nous avec votre <strong>nom, numéro de téléphone et date approximative d'achat</strong>, nous retrouverons votre commande dans notre système."
                    },
                    {
                      q: "Le téléphone doit-il être dans son emballage d'origine ?",
                      a: "L'emballage d'origine est <strong>souhaité mais pas obligatoire</strong>. L'essentiel est que le téléphone soit complet avec ses accessoires (chargeur, câble) et sans dommages physiques."
                    }
                  ].map((faq, i) => (
                    <details key={i} className="group bg-background border border-border/50 rounded-xl p-6">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="font-semibold text-foreground pr-4">{faq.q}</h3>
                        <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 rounded-3xl p-8 sm:p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Besoin d'Aide ?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions
                  sur notre politique de remboursement ou pour démarrer une procédure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+213542304569"
                    className="group px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Appeler : +213 542 30 45 69</span>
                  </a>
                  <a
                    href="mailto:info@Timossilo.com"
                    className="px-8 py-4 bg-card border border-border/50 text-foreground rounded-xl font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Email : info@Timossilo.com</span>
                  </a>
                </div>
                <p className="mt-6 text-sm text-muted-foreground">
                  <strong>Horaires :</strong> Dimanche - Jeudi : 9h - 18h | Vendredi : 9h - 12h / 14h - 18h | Samedi : Fermé
                </p>
              </div>
            </section>

            {/* Legal Notice */}
            <section className="mt-12 p-6 bg-muted/30 border border-border/50 rounded-2xl">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Note Légale
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cette politique de remboursement s'ajoute à vos droits légaux en vertu de la loi algérienne sur la protection des consommateurs
                (Loi n° 09-03 du 25 février 2009). Elle ne limite en aucun cas vos droits statutaires.
                En cas de litige, une solution amiable sera privilégiée. À défaut, les tribunaux compétents d'Algérie seront saisis.
                <br /><br />
                <strong>Timossilo Polymobile</strong> - Constantine, Algérie | SIRET : En cours d'immatriculation |
                Email : info@Timossilo.com | Tél : +213 542 30 45 69
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
