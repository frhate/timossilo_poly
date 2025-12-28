export function getProductImageUrl(url: string, options?: {
  width?: number
  quality?: 'auto' | number
}): string {
  const uploadIndex = url.indexOf('/upload/')
  if (uploadIndex === -1) return url

  const { width = 800, quality = 'auto' } = options || {}

  const transformations = [
    'f_auto',
    `q_${quality}`,
    `w_${width}`,
    'c_scale',
    'dpr_auto', // Auto device pixel ratio
  ].join(',')

  return url.slice(0, uploadIndex + 8) + transformations + '/' + url.slice(uploadIndex + 8)
}