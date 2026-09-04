export type Episode = {
  id: string
  title: string
  summary: string
  publishedAt: string
  durationSeconds?: number
  episode?: number
  season?: number
  image?: string
  audioUrl?: string
  url: string
  /** Thumbnail of the matching YouTube upload, when one was found. */
  thumbnail?: string
  /** The matching YouTube upload, when one was found. */
  videoUrl?: string
}

export type Video = {
  id: string
  title: string
  summary: string
  publishedAt: string
  url: string
  thumbnail: string
  /** Length in seconds. From the watch page, so the RSS fallback lacks it. */
  durationSeconds?: number
  /** Lifetime view count, same caveat. */
  views?: number
}

export type Product = {
  id: string
  name: string
  handle: string
  price: number
  image: string
  colors: { name: string; hex: string }[]
  sizes: string[]
  collection: string
  url: string
}
