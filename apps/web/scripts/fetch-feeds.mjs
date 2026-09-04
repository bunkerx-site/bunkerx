/**
 * Pulls every external source once, at build time, and writes normalised JSON
 * into src/data.
 *
 * This runs at build rather than in the browser for two reasons. The YouTube
 * feed sends no CORS header at all, so a client-side fetch can never work; and
 * fetching per visit would put three third parties on the critical path of a
 * site whose content changes weekly. The generated files are committed, so a
 * build succeeds with no network and the site degrades to the last known good
 * data instead of to an empty page.
 *
 * Run with: pnpm --filter @bunkerx/web feeds
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(HERE, '../src/data')

const PODCAST_RSS = 'https://anchor.fm/s/d02d9508/podcast/rss'
const CHANNELS = {
  main: 'UCp45QZZjzscyReCPrzcP3gQ',
  cuts: 'UC2MA6vHk6D4796wK9Ps5Yyw',
}
const STORE = 'https://montink.com/bunker-x'
const STORE_COLLECTIONS = [
  'lancamentos',
  'mais_vendidos',
  'camisas',
  'canecas',
  'bones',
  'itens-do-agente-bunker-x',
  'outros-produtos',
]

const UA = 'Mozilla/5.0 (compatible; bunkerx-site-build/1.0)'
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

async function get(url) {
  const response = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${url}`)
  return response.text()
}

/**
 * Every title ends with the show's own name — "… | BUNKER X Podcast",
 * "… | CORTES DO BUNKER X". On a page that already says Bunker X in the
 * header, repeating it on every card is noise.
 */
function trimTitle(title) {
  return title
    // Hashtags come after the show name, so they have to go first.
    .replace(/(?:\s*#[\p{L}\p{N}_]+)+\s*$/gu, '')
    .replace(/\s*\|\s*(cortes do\s*)?bunker\s*x(\s+podcast)?\s*$/i, '')
    .replace(/\s*[-–—]\s*bunker\s*x\s*$/i, '')
    .replace(/\s*\|\s*$/, '')
    .trim()
}

/** Always work with an array, whether the parser saw one node or many. */
const list = (value) => (Array.isArray(value) ? value : value ? [value] : [])

/** Strips tags and collapses whitespace; feed summaries arrive as loose HTML. */
function plain(html) {
  if (!html) return ''
  return String(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Feed descriptions are a stack of blocks separated by rules of dashes, and
 * the promotional ones move around: sometimes the membership pitch comes
 * first, sometimes the synopsis does.
 *
 * Rejecting any block that contains a URL is too blunt — plenty of real
 * synopses cite a source mid-sentence. So a block is judged by how much prose
 * survives once links are removed, plus whether it opens with a known pitch.
 */
const PITCH = /^(seja membro|clique aqui|nossos canais|tamb[ée]m estamos|insider|assine|apoie|garanta|use o cupom|link)/i
const URL = /https?:\/\/\S+|www\.\S+|\b[a-z0-9-]+\.(com|br|cc|me|tv)\/\S*/gi

function synopsis(html) {
  const text = plain(html)
  if (!text) return ''

  for (const raw of text.split(/-{6,}/)) {
    const block = raw.replace(/(?:#\S+\s*)+/g, ' ').trim()
    if (!block || PITCH.test(block)) continue

    // What is left once every link and its label are gone. A block that is
    // mostly links collapses to nothing here and gets skipped.
    const prose = block.replace(URL, '').replace(/\s+/g, ' ').trim()
    if (prose.length >= 80) return prose
  }

  return ''
}

/** iTunes durations come as seconds, mm:ss or hh:mm:ss. */
function toSeconds(value) {
  if (value === undefined || value === null) return undefined
  const text = String(value).trim()
  if (/^\d+$/.test(text)) return Number(text)
  const parts = text.split(':').map(Number)
  if (parts.some(Number.isNaN)) return undefined
  return parts.reduce((total, part) => total * 60 + part, 0)
}

async function podcast() {
  const feed = parser.parse(await get(PODCAST_RSS))
  const channel = feed.rss.channel
  const fallbackImage = channel['itunes:image']?.['@_href']

  return list(channel.item).map((item) => ({
    id: String(item.guid?.['#text'] ?? item.guid ?? item.link),
    title: trimTitle(plain(item.title)),
    /*
     * Long enough that "Ver mais" has something to reveal.
     *
     * At 400 this was shorter than the two lines the archive shows collapsed
     * plus a little, so expanding a row gained the reader almost nothing. The
     * cap is still here because a handful of these descriptions carry the
     * show's entire credits block, and none of that is a synopsis.
     */
    summary: synopsis(item.description).slice(0, 1800),
    publishedAt: new Date(item.pubDate).toISOString(),
    durationSeconds: toSeconds(item['itunes:duration']),
    episode: item['itunes:episode'] ? Number(item['itunes:episode']) : undefined,
    season: item['itunes:season'] ? Number(item['itunes:season']) : undefined,
    image: item['itunes:image']?.['@_href'] ?? fallbackImage,
    audioUrl: item.enclosure?.['@_url'],
    url: item.link,
  }))
}

async function youtube(channelId) {
  const feed = parser.parse(
    await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`),
  )
  return list(feed.feed.entry).map((entry) => ({
    id: entry['yt:videoId'],
    title: trimTitle(plain(entry.title)),
    summary: synopsis(entry['media:group']?.['media:description']).slice(0, 300),
    publishedAt: new Date(entry.published).toISOString(),
    url: `https://www.youtube.com/watch?v=${entry['yt:videoId']}`,
    // maxresdefault 404s on some uploads; hqdefault always exists.
    thumbnail: `https://i.ytimg.com/vi/${entry['yt:videoId']}/hqdefault.jpg`,
  }))
}

/**
 * Montink renders each collection server-side and leaves the products in a
 * `__PRODUTOS__` global. There is no public JSON endpoint — the /Api* routes
 * the storefront uses are authenticated — so this reads that array. It is a
 * stable JSON contract rather than DOM scraping, but it is still their page,
 * so a failure here must not fail the build.
 */
async function store() {
  const seen = new Map()
  for (const collection of STORE_COLLECTIONS) {
    try {
      const html = await get(`${STORE}/${collection}`)
      const match = html.match(/__PRODUTOS__\s*=\s*(\[[\s\S]*?\]);/)
      if (!match) continue
      for (const product of JSON.parse(match[1])) {
        seen.set(product.handle, {
          id: String(product.id),
          name: product.product_name,
          handle: product.handle,
          price: Number(String(product.price).replace('.', '').replace(',', '.')),
          image: product.image_url,
          colors: (product.product_colors ?? []).map((c) => ({ name: c.cor, hex: c.hex })),
          sizes: Object.values(product.sizes ?? {}),
          collection,
          url: `${STORE}/produto/${product.handle}`,
        })
      }
    } catch (error) {
      console.warn(`  ! ${collection}: ${error.message}`)
    }
  }
  return [...seen.values()]
}

/**
 * Matches podcast episodes to their YouTube upload by title.
 *
 * The two feeds describe the same recording but are published separately, so
 * nothing links them. Titles are near-identical in practice, so Jaccard
 * similarity over normalised word sets is enough — and it fails safe: below
 * the threshold an episode simply keeps its own artwork.
 *
 * Worth having because YouTube thumbnails are made per episode, while the
 * podcast feed reuses the show's cover art for a third of the archive.
 */
function normalise(title) {
  return new Set(
    title
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2),
  )
}

function similarity(a, b) {
  const shared = [...a].filter((word) => b.has(word)).length
  const union = new Set([...a, ...b]).size
  return union === 0 ? 0 : shared / union
}

function linkVideos(episodes, videos) {
  const indexed = videos.map((video) => ({ video, words: normalise(video.title) }))

  return episodes.map((episode) => {
    const words = normalise(episode.title)
    let best = null
    let bestScore = 0

    for (const candidate of indexed) {
      const score = similarity(words, candidate.words)
      if (score > bestScore) {
        bestScore = score
        best = candidate.video
      }
    }

    if (!best || bestScore < 0.6) return episode
    return { ...episode, videoUrl: best.url, thumbnail: best.thumbnail }
  })
}

async function write(name, data) {
  await writeFile(resolve(OUT, `${name}.json`), `${JSON.stringify(data, null, 2)}\n`)
  console.log(`  ${name}.json — ${data.length} itens`)
}

await mkdir(OUT, { recursive: true })
console.log('buscando fontes externas…')

const [episodes, videos, cuts, products] = await Promise.all([
  podcast(),
  youtube(CHANNELS.main),
  youtube(CHANNELS.cuts),
  store(),
])

// The podcast archive is the only complete history; the YouTube feeds cap at
// 15 entries with no pagination, which is a limit of the source, not a choice.
//
// The full archive is written for a future episode index, but the home page
// only ever shows a handful. Importing all 174 would ship the entire back
// catalogue — summaries included — to every visitor to render six cards, so a
// trimmed file is emitted alongside it.
const linked = linkVideos(episodes, [...videos, ...cuts])
const matched = linked.filter((episode) => episode.thumbnail).length
console.log(`  ${matched}/${linked.length} episódios casados com um vídeo`)

await write('episodes', linked)
await write('episodes-latest', linked.slice(0, 12))
/*
 * The main channel's uploads are not written out any more.
 *
 * They are still fetched, because matching an episode to its video is what
 * `linkVideos` does with them — but nothing imports the file. The archive
 * carries every episode's video alongside its audio now, so a separate list
 * of uploads had no reader.
 *
 * Four of the fifteen uploads are not episodes (two clips, two mini-features)
 * and currently appear nowhere on the site. Restoring one `write` call brings
 * the list back if they are given a home.
 */
await write('cuts', cuts)
await write('products', products)
console.log('pronto.')
