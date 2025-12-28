import {MetadataRoute} from 'next'
import {createClient} from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://timossilo-polymobile.com'
    const supabase = await createClient()

    // Fetch all products
    const {data: products} = await supabase
        .from('products')
        .select('id, slug, updated_at')
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

    ]

    // Dynamic product URLs
    const productUrls: MetadataRoute.Sitemap = (products || []).map((product) => ({
        url: `${baseUrl}/products/${product.slug || product.id}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly',
        priority: 0.6,
    }))

    // Dynamic category URLs
    const categoryUrls: MetadataRoute.Sitemap = (categories || []).map((category) => ({
        url: `${baseUrl}/products?category=${category.slug}`,
        lastModified: new Date(category.updated_at || new Date()),
        changeFrequency: 'daily',
        priority: 0.7,
    }))

    // Dynamic brand URLs
    const brandUrls: MetadataRoute.Sitemap = (brands || []).map((brand) => ({
        url: `${baseUrl}/products?brand=${brand.slug}`,
        lastModified: new Date(brand.updated_at || new Date()),
        changeFrequency: 'daily',
        priority: 0.7,
    }))

    return [...staticUrls, ...productUrls, ...categoryUrls, ...brandUrls]
}