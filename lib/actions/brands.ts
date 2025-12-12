'use server'

  import { createClient } from '@/lib/supabase/server'

  export interface Brand {
    id: string
    name: string
    slug: string | null
    image_url: string | null
    product_count?: number
  }

  export async function getBrands(): Promise<Brand[]> {
    const supabase = await createClient()

    const { data: brands, error } = await supabase
      .from('brands')
      .select('id, name, slug, image_url')
      .order('name')

    if (error) {
      console.error('Error fetching brands:', error)
      return []
    }

    if (!brands) {
      return []
    }

    // Get product count for each brand
    const brandsWithCount = await Promise.all(
      brands.map(async (brand: Brand) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('brand_id', brand.id)

        return {
          ...brand,
          product_count: count || 0
        }
      })
    )

    return brandsWithCount.filter((b: Brand) => (b.product_count || 0) > 0)
  }