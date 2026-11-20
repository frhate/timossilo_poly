type FbqFunction = ((...args: any[]) => void) & {
  callMethod?: (...args: any[]) => void
  queue?: any[]
  push?: any
  loaded?: boolean
  version?: string
}

interface Window {
  fbq: FbqFunction
  _fbq?: FbqFunction
}
