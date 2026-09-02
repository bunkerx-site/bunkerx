/**
 * Seeded PRNG (mulberry32).
 *
 * The layout of the bars and particles is random, but it must be *stable*: a
 * re-render should not reshuffle the screen, and a visual snapshot should be
 * reproducible. Seeding gives us variety without volatility.
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Random float in [min, max). */
export function between(random: () => number, min: number, max: number): number {
  return min + random() * (max - min)
}
