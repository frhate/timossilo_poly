import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Timosilo - Boutique de Téléphones et Appareils Électroniques",
  description: "La meilleure boutique pour téléphones, ordinateurs et accessoires en Algérie - Timosilo",
  keywords: ["téléphones", "smartphones", "ordinateurs", "appareils électroniques", "accessoires", "Algérie", "Timosilo"],
  authors: [{ name: "Timosilo" }],
  creator: "Timosilo",
  publisher: "Timosilo",
  metadataBase: new URL("https://timossilo-polymobile.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: "https://timossilo-polymobile.com",
    title: "Timosilo - Boutique de Téléphones et Appareils Électroniques",
    description: "La meilleure boutique pour téléphones, ordinateurs et accessoires en Algérie - Timosilo",
    siteName: "Timosilo",
    images: [
      {
        url: "https://timossilo-polymobile.com/logo.jpg", // Add an Open Graph image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "Timosilo - Boutique Électronique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Timosilo - Boutique de Téléphones et Appareils Électroniques",
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
    apple: "/apple-icon.png",
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
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
