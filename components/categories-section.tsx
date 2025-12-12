"use client"

                 import Link from "next/link"
                 import {ArrowRight, Sparkles} from "lucide-react"
                 import {useEffect, useState} from "react"

                 interface Category {
                     id: string
                     name: string
                     slug: string
                 }

                 export default function CategoriesSection({categories}: { categories: Category[] }) {
                     const [isLoaded, setIsLoaded] = useState(false)
                     const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
                     const [isPaused, setIsPaused] = useState(false)

                     useEffect(() => {
                         setIsLoaded(true)
                     }, [])

                     // Duplicate categories for seamless infinite scroll
                     const duplicatedCategories = [...categories, ...categories, ...categories]

                     return (
                         <section id="categories"
                                  className="relative w-full bg-background py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
                             {/* Animated background decorations */}
                             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                 <div
                                     className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl opacity-40 animate-pulse"/>
                                 <div
                                     className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl opacity-40 animate-pulse"
                                     style={{animationDelay: '2s'}}/>
                                 <div
                                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[600px] lg:h-[600px] bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-full blur-3xl opacity-30"/>
                             </div>

                             <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                 {/* Section Header */}
                                 <div
                                     className={`mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                     <div
                                         className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/20 rounded-full mb-3 sm:mb-4 md:mb-6 hover:bg-primary/15 transition-colors">
                                         <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary animate-pulse"/>
                                         <span className="text-xs sm:text-sm font-semibold text-primary">Explorez Nos Catégories</span>
                                     </div>

                                     <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-2 sm:mb-3 md:mb-4 lg:mb-6 px-2 sm:px-4">
                                         Nos
                                         <span className="block bg-primary bg-clip-text text-transparent animate-gradient mt-1">
                                             Collections Complètes
                                         </span>
                                     </h2>
                                     <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                                         Découvrez une sélection premium de produits technologiques organisée par catégories pour vous
                                         faciliter la recherche
                                     </p>
                                 </div>

                                 {/* Categories Auto-Scroll */}
                                 {categories.length === 0 ? (
                                     <div className="text-center py-8 sm:py-12 md:py-16 lg:py-24">
                                         <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                             <Sparkles
                                                 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-muted-foreground/40 mx-auto"/>
                                             <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium px-4">Aucune catégorie
                                                 disponible pour le moment</p>
                                         </div>
                                     </div>
                                 ) : (
                                     <div className="relative">
                                         <style jsx>{`
                                             @keyframes scroll-left {
                                                 0% {
                                                     transform: translateX(0);
                                                 }
                                                 100% {
                                                     transform: translateX(calc(-33.333%));
                                                 }
                                             }
                 
                                             @keyframes gradient {
                                                 0%, 100% {
                                                     background-position: 0% 50%;
                                                 }
                                                 50% {
                                                     background-position: 100% 50%;
                                                 }
                                             }
                 
                                             .animate-scroll {
                                                 animation: scroll-left 40s linear infinite;
                                             }
                 
                                             @media (max-width: 640px) {
                                                 .animate-scroll {
                                                     animation: scroll-left 25s linear infinite;
                                                 }
                                             }
                 
                                             .animate-scroll.paused {
                                                 animation-play-state: paused;
                                             }
                 
                                             .animate-gradient {
                                                 background-size: 200% auto;
                                                 animation: gradient 3s ease infinite;
                                             }
                                         `}</style>

                                         {/* Gradient overlays */}
                                         <div
                                             className="absolute left-0 top-0 bottom-0 w-6 sm:w-10 md:w-16 lg:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"/>
                                         <div
                                             className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 md:w-16 lg:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"/>

                                         <div className="overflow-hidden py-2 sm:py-3 md:py-4">
                                             <div
                                                 className={`flex gap-2.5 sm:gap-4 md:gap-5 lg:gap-8 ${isPaused ? 'animate-scroll paused' : 'animate-scroll'}`}
                                                 onMouseEnter={() => setIsPaused(true)}
                                                 onMouseLeave={() => setIsPaused(false)}
                                                 onTouchStart={() => setIsPaused(true)}
                                                 onTouchEnd={() => setIsPaused(false)}
                                             >
                                                 {duplicatedCategories.map((category, index) => (
                                                     <Link
                                                         key={`${category.id}-${index}`}
                                                         href={`/products?category=${category.slug}`}
                                                         className="flex-shrink-0 w-56 xs:w-60 sm:w-72 md:w-80 lg:w-96"
                                                     >
                                                         <div
                                                             className={`group relative h-full rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 transform active:scale-95 sm:hover:scale-105 ${
                                                                 hoveredIndex === index ? 'ring-2 ring-primary shadow-2xl shadow-primary/30' : 'hover:shadow-xl'
                                                             }`}
                                                             style={{
                                                                 border: '1px solid var(--border)',
                                                             }}
                                                             onMouseEnter={() => setHoveredIndex(index)}
                                                             onMouseLeave={() => setHoveredIndex(null)}
                                                         >
                                                             {/* Card Background Gradient */}
                                                             <div
                                                                 className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/50 group-hover:from-primary/5 group-hover:via-card group-hover:to-accent/5 transition-all duration-500"/>

                                                             {/* Content */}
                                                             <div
                                                                 className="relative p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between min-h-24 sm:min-h-28 md:min-h-32">
                                                                 <div>
                                                                     <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5 sm:mb-2 md:mb-3 line-clamp-2 leading-tight">
                                                                         {category.name}
                                                                     </h3>
                                                                     <p className="text-xs sm:text-sm md:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 line-clamp-2 leading-snug">
                                                                         Découvrez notre sélection exclusive
                                                                         de {category.name.toLowerCase()}
                                                                     </p>
                                                                 </div>

                                                                 {/* Arrow indicator */}
                                                                 <div
                                                                     className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 text-primary font-semibold text-xs sm:text-sm md:text-base mt-2 sm:mt-3 md:mt-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all duration-300">
                                                                     Explorer
                                                                     <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5"/>
                                                                 </div>
                                                             </div>

                                                             {/* Bottom accent bar */}
                                                             <div
                                                                 className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                                         </div>
                                                     </Link>
                                                 ))}
                                             </div>
                                         </div>

                                         {/* Pause indicator - Hidden on mobile for cleaner UI */}
                                         <div
                                             className={`hidden sm:block text-center mt-4 sm:mt-6 transition-opacity duration-300 ${isPaused ? 'opacity-100' : 'opacity-0'}`}>
                                             <p className="text-xs text-muted-foreground">Défilement en pause</p>
                                         </div>
                                     </div>
                                 )}
                             </div>

                         </section>
                     )
                 }