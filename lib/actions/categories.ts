'use server'

import { createClient } from '@/lib/supabase/server'

export interface Category {
    id: string
    name: string
    slug: string
}

export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name')

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return (data as Category[]) || []
}

