"use client"

import { ArrowRight, Zap, Shield, Truck } from "lucide-react"
import { useEffect, useState } from "react"

export default function HeroSection() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div className="relative w-full overflow-hidden bg-background">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse animation-delay-2000" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left column - Text content */}
                    <div className={`space-y-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full w-fit hover:bg-primary/15 transition-colors">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">Nouvelles Technologiques</span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-6">
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
                                Découvrez la
                                <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                                    Technologie du Future
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                                Accédez à une large sélection de smartphones, ordinateurs et accessoires électroniques des meilleures marques mondiales. Qualité garantie et prix compétitifs.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <a
                                href="/products"
                                className="group px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 inline-flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105"
                            >
                                Commencer à Magasiner
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#categories"
                                className="px-8 py-4 border-2 border-primary/30 bg-background text-foreground rounded-lg font-semibold hover:border-primary hover:bg-primary/5 transition-all duration-300 inline-flex items-center justify-center whitespace-nowrap"
                            >
                                Explorer Maintenant
                            </a>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                            <div className="group space-y-2 hover:translate-y-1 transition-transform">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">100%</div>
                                    <p className="text-sm text-muted-foreground">Authentique</p>
                                </div>
                            </div>
                            <div className="group space-y-2 hover:translate-y-1 transition-transform">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Truck className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">Rapide</div>
                                    <p className="text-sm text-muted-foreground">Livraison</p>
                                </div>
                            </div>
                            <div className="group space-y-2 hover:translate-y-1 transition-transform">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Zap className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">24/7</div>
                                    <p className="text-sm text-muted-foreground">Support</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 pt-4">
                            <div>
                                <div className="text-3xl font-bold text-primary">1000+</div>
                                <p className="text-sm text-muted-foreground">Produits en stock</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">5000+</div>
                                <p className="text-sm text-muted-foreground">Clients satisfaits</p>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Visual representation */}
                    <div className={`hidden lg:flex items-center justify-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="relative w-full max-w-md">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 rounded-3xl blur-3xl animate-pulse" />

                            {/* Main card */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                                <div className="relative aspect-square bg-gradient-to-br from-card to-card/50 rounded-3xl border border-primary/20 p-8 flex flex-col items-center justify-center backdrop-blur-sm overflow-hidden group-hover:border-primary/40 transition-colors duration-300">
                                    {/* Decorative elements */}
                                    <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
                                    <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-2xl" />

                                    {/* Content */}
                                    <div className="relative text-center space-y-6">
                                        {/* Icon with animation */}
                                        <div className="inline-flex items-center justify-center">
                                            <div className="relative w-40 h-40">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-xl animate-pulse" />
                                                <div className="absolute inset-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-spin" style={{animationDuration: '3s'}} />
                                                <div className="absolute inset-0 flex items-center justify-center rounded-full">
                                                    <span className="text-7xl drop-shadow-lg">📱</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Text */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground mb-2">Dernier Modèle</h3>
                                            <p className="text-sm text-muted-foreground">Technologie premium certifiée 100%</p>
                                        </div>

                                        {/* CTA Button */}
                                        <button className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                                            Voir les Détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

