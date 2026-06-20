import {MetadataRoute} from 'next'
import {createClient} from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://timossilo-polymobile.com'
    const supabase = await createClient()

    // Fetch all products
    const {data: products} = await supabase
        .from('products')
        .select('id, slug, updated_at, name, image_urls')
        .order('updated_at', {ascending: false})

    // Fetch all categories
    const {data: categories} = await supabase
        .from('categories')
        .select('slug, updated_at')

    // Fetch all brands
    const {data: brands} = await supabase
        .from('brands')
        .select('slug, updated_at')

    // Static URLs
    const staticUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
    ]

    // Dynamic product URLs - each product gets its own sitemap entry
    const productUrls: MetadataRoute.Sitemap = (products || []).map((product) => {
        const entry: MetadataRoute.Sitemap[number] = {
            url: `${baseUrl}/products/${product.slug || product.id}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }

        // Add image sitemap entry if product has images
        if (product.image_urls && product.image_urls.length > 0 && product.image_urls[0]) {
            // Note: Next.js sitemap doesn't support image sitemap directly in the same entry
            // but we include the product URL so Google can discover images
        }

        return entry
    })

    // Deduplicate product URLs by URL
    const seenUrls = new Set<string>()
    const uniqueProductUrls = productUrls.filter((entry) => {
        if (seenUrls.has(entry.url)) return false
        seenUrls.add(entry.url)
        return true
    })

    // Dynamic category URLs (only if they have slugs)
    const categoryUrls: MetadataRoute.Sitemap = (categories || [])
        .filter((category) => category.slug)
        .map((category) => ({
            url: `${baseUrl}/products?category=${category.slug}`,
            lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }))

    // Dynamic brand URLs (only if they have slugs)
    const brandUrls: MetadataRoute.Sitemap = (brands || [])
        .filter((brand) => brand.slug)
        .map((brand) => ({
            url: `${baseUrl}/products?brand=${brand.slug}`,
            lastModified: brand.updated_at ? new Date(brand.updated_at) : new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }))

    return [...staticUrls, ...uniqueProductUrls, ...categoryUrls, ...brandUrls]
}