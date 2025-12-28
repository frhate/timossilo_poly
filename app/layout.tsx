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
  icons: {
    icon: [
      {
        url: "icon-dark-32x32.png",
      },
    ],
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
