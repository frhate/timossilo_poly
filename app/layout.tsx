import React, {Suspense} from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import FacebookPixel from "@/components/FacebookPixel";
import OrganizationSchema from "@/components/seo/organization-schema";
import WebsiteSchema from "@/components/seo/website-schema";

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://timossilo-polymobile.com"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-dz": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: "https://timossilo-polymobile.com",
    siteName: "Timossilo Polymobile",
    images: [
      {
        url: "https://timossilo-polymobile.com/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Timossilo - Boutique Électronique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
      <head>
        <link rel="alternate" hrefLang="fr-dz" href="https://timossilo-polymobile.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://timossilo-polymobile.com/" />
      </head>
      <body className={`${montserrat.className} font-sans antialiased flex flex-col min-h-screen`}>
      <Suspense fallback={null}>
          <FacebookPixel />
      </Suspense>
      <OrganizationSchema />
      <WebsiteSchema />
      <div className="flex-1">{children}</div>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
