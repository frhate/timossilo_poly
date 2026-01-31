'use client'

import { Brands } from "@/lib/types/admin"
import Image from "next/image"
import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface BrandSliderProps {
    brands: Brands[]
    selectedBrand?: string
}

export default function BrandSlider({ brands, selectedBrand }: BrandSliderProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            })
            setTimeout(checkScroll, 300)
        }
    }

    return (
        <div className="w-full mb-8 sm:mb-10 lg:mb-12">
            <div className="mb-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    Parcourir par marque
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Découvrez nos meilleures marques
                </p>
            </div>

            <div className="relative group">
                {/* Left Arrow */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                )}

                {/* Brand Slider Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-10 sm:px-12 py-4"
                >
                    {brands.map((brand) => {
                        const isSelected = selectedBrand === brand.slug
                        return (
                            <Link
                                key={brand.id}
                                href={`/products?brand=${brand.slug}`}
                                className={`flex-shrink-0 transition-all duration-300 transform hover:scale-105 ${
                                    isSelected ? 'scale-110' : ''
                                }`}
                            >
                                <div
                                    className={`relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                                        isSelected
                                            ? 'border-blue-600 shadow-lg'
                                            : 'border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'
                                    }`}
                                >
                                    {brand.image_url ? (
                                        <Image
                                            src={brand.image_url}
                                            alt={brand.name}
                                            fill
                                            className="object-contain p-3 sm:p-4 bg-white"
                                            sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <span className="text-xs sm:text-sm font-semibold text-gray-600 text-center px-2">
                                                {brand.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-700 text-center truncate px-1">
                                    {brand.name}
                                </p>
                            </Link>
                        )
                    })}
                </div>

                {/* Right Arrow */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                )}
            </div>
        </div>
    )
}