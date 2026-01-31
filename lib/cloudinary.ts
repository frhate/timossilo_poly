/**
 * Server-based image storage helpers
 * Images are stored at: /var/www/uploads/products/{productId}/{filename}
 * Served via: https://timossilo-polymobile.com/uploads/products/{productId}/{filename}
 */

/**
 * Get optimized image URL for display
 * Images are pre-optimized to WebP format on the server
 * @param url - The full image URL
 * @returns Optimized image URL
 */
export function getProductImageUrl(url: string): string {
  // Images are already optimized to WebP on server
  // This function maintains API compatibility with previous version
  return url
}
