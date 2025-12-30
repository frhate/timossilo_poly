// Shared type definitions for admin components

export interface Category {
    id: string
    name: string
    slug: string
    created_at?: string
}

export interface Product {
    id: string
    name: string
    price: number
    stock: number
    brand_id: string
    category_id: string
    image_urls: string[]
    description?: string
    created_at: string
    categories?: {
        name: string
    }
    brands?: {
        name: string
    }
}


export interface Brands {
    id: string
    name: string
    slug?: string
    image_url?: string
    created_at: string
}

export interface OrderItem {
    id: string
    product_id: string
    quantity: number
    price: number
    products: {
        name: string
        image_url: string | null
        image_urls: string []
    }
}

export interface Order {
    id: string
    user_id: string
    total_amount: number
    status: OrderStatus
    created_at: string
    customer_phone: string
    customer_address: string
    order_items: OrderItem[]
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "En attente",
    confirmed: "Confirmé",
    processing: "En cours de traitement",
    shipped: "Expédié",
    delivered: "Livré",
    cancelled: "Annulé",
}


export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    processing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

