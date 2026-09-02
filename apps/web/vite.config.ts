import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const SITE_URL = 'https://www.bunkerx.com.br'

type Episode = { title: string; summary: string; publishedAt: string; url: string; durationSeconds?: number }

const read = <T,>(name: string): T =>
  JSON.parse(readFileSync(resolve(import.meta.dirname, `src/data/${name}.json`), 'utf8'))

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** ISO 8601 duration, which is what schema.org expects. */
function iso8601(seconds?: number): string | undefined {
  if (!seconds) return undefined
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return `PT${h > 0 ? `${h}H` : ''}${m}M`
}

/**
 * Injects metadata and structured data into index.html at build time.
 *
 * This is a single-page app, so the HTML a crawler receives is an empty div —
 * whatever Google's renderer eventually does with the JavaScript, the title,
 * description, social card and schema have to be in the served markup. They
 * are generated from the same feed data the page renders, so they cannot drift
 * from what is actually on the site.
 */
function seo(): Plugin {
  return {
    name: 'bunkerx-seo',
    transformIndexHtml(html) {
      const episodes = read<Episode[]>('episodes-latest')
      const latest = episodes[0]

      const series = {
        '@context': 'https://schema.org',
        '@type': 'PodcastSeries',
        name: 'Bunker X',
        url: SITE_URL,
        description:
          'OVNIs, aparições ectoplásmicas e criaturas sobrenaturais, investigados por Affonso Solano e Afonso 3D. Toda segunda, 20h.',
        inLanguage: 'pt-BR',
        webFeed: 'https://anchor.fm/s/d02d9508/podcast/rss',
        image: `${SITE_URL}/brand/logo-bunkerx.jpg`,
        author: [
          { '@type': 'Person', name: 'Affonso Solano' },
          { '@type': 'Person', name: 'Afonso 3D' },
        ],
        sameAs: [
          'https://open.spotify.com/show/1YOCI7QdvUloo4VopSr7qm',
          'https://podcasts.apple.com/us/podcast/bunker-x/id1683012389',
          'https://www.youtube.com/@bunkerx',
          'https://instagram.com/bunkerxpodcast',
        ],
      }

      const items = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: episodes.slice(0, 10).map((episode, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'PodcastEpisode',
            name: episode.title,
            description: episode.summary || undefined,
            datePublished: episode.publishedAt,
            timeRequired: iso8601(episode.durationSeconds),
            url: episode.url,
            partOfSeries: { '@type': 'PodcastSeries', name: 'Bunker X', url: SITE_URL },
          },
        })),
      }

      const description = `${latest.title} — o episódio mais recente do Bunker X. OVNIs, conspirações e assombrações com Affonso Solano e Afonso 3D, toda segunda às 20h.`

      const tags = [
        `<link rel="canonical" href="${SITE_URL}/" />`,
        `<meta name="description" content="${escape(description)}" />`,
        `<meta property="og:url" content="${SITE_URL}/" />`,
        `<meta property="og:description" content="${escape(description)}" />`,
        `<meta name="twitter:description" content="${escape(description)}" />`,
        `<script type="application/ld+json">${JSON.stringify(series)}</script>`,
        `<script type="application/ld+json">${JSON.stringify(items)}</script>`,
      ].join('\n    ')

      return html.replace('</head>', `  ${tags}\n  </head>`)
    },
  }
}

export default defineConfig({ plugins: [react(), seo()] })
