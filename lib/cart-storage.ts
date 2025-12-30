"use client"

// Guest cart management using localStorage

export interface GuestCartItem {
  productId: string
  quantity: number
}

const CART_STORAGE_KEY = "guest_cart"

export const guestCart = {
  // Get all items from guest cart
  getItems(): GuestCartItem[] {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  // Add or update item in guest cart
  setItem(productId: string, quantity: number) {
    const items = this.getItems()
    const existingIndex = items.findIndex((item) => item.productId === productId)

    if (existingIndex >= 0) {
      items[existingIndex].quantity = quantity
    } else {
      items.push({ productId, quantity })
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  },

  // Remove item from guest cart
  removeItem(productId: string) {
    const items = this.getItems().filter((item) => item.productId !== productId)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  },

  // Update quantity
  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId)
      return
    }
    this.setItem(productId, quantity)
  },

  // Clear all items
  clear() {
    localStorage.removeItem(CART_STORAGE_KEY)
  },

  // Get count of items
  getCount(): number {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0)
  },
}

