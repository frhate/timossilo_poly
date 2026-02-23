import React, {Suspense} from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import MetaPixel from "@/components/meta-pixel"
import "./globals.css"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Timossilo - Boutique de Téléphones et Appareils Électroniques",
  description: "La meilleure boutique pour téléphones, ordinateurs et accessoires en Algérie - Timossilo",
  keywords: ["téléphones", "smartphones", "ordinateurs", "appareils électroniques", "accessoires", "Algérie", "Timossilo"],
  authors: [{ name: "Timossilo" }],
  creator: "Timossilo",
  publisher: "Timossilo",
  metadataBase: new URL("https://timossilo-polymobile.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: "https://timossilo-polymobile.com",
    title: "Timossilo - Boutique de Téléphones et Appareils Électroniques",
    description: "La meilleure boutique pour téléphones, ordinateurs et accessoires en Algérie - Timossilo",
    siteName: "Timossilo",
    images: [
      {
        url: "https://timossilo-polymobile.com/logo.jpg", // Add an Open Graph image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "Timossilo - Boutique Électronique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Timossilo - Boutique de Téléphones et Appareils Électroniques",
    description: "La meilleure boutique pour téléphones, ordinateurs et accessoires en Algérie",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon-dark-32x32.png",
    apple: "/icon-dark-32x32.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" dir="ltr">
      <body className={`${montserrat.className} font-sans antialiased flex flex-col min-h-screen`}>
      <Suspense fallback={null}>
          <MetaPixel />
      </Suspense>
      <div className="flex-1">{children}</div>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
