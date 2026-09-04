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

/** The named entities that actually turn up in these two feeds. */
const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '\u2026',
  mdash: '\u2014',
  ndash: '\u2013',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201c',
  rdquo: '\u201d',
}

/** Named, decimal and hex references in one pass, so none can re-encode another. */
function decode(text) {
  return text.replace(/&(#[xX]?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body) => {
    if (body[0] !== '#') return ENTITIES[body.toLowerCase()] ?? whole
    const digits = body[1] === 'x' || body[1] === 'X' ? body.slice(2) : body.slice(1)
    const code = Number.parseInt(digits, body[1] === 'x' || body[1] === 'X' ? 16 : 10)
    return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : whole
  })
}

/** Line breaks become spaces; every other tag just goes. */
function strip(text) {
  return text.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')
}

/**
 * Strips tags and collapses whitespace; feed summaries arrive as loose HTML.
 *
 * Stripped and decoded twice, because the podcast host does not escape
 * consistently. Most descriptions arrive as ordinary HTML, and some arrive
 * with the markup escaped a second time — those survived a single strip with
 * their tags intact as text, and the page printed "&lt;p&gt;No episódio de
 * hoje" at the top of the synopsis. A second pass over the output of the first
 * catches whatever the decode has just turned back into a tag.
 */
function plain(html) {
  if (!html) return ''
  let text = String(html)
  for (let pass = 0; pass < 2; pass += 1) text = decode(strip(text))
  return text.replace(/\s+/g, ' ').trim()
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
const PITCH =
  /^(seja membro|clique aqui|nossos canais|tamb[ée]m estamos|insider|assine|apoie|garanta|use o cupom|link|este programa foi|quer contratar)/i
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
     * The whole synopsis, not a lead-in to it.
     *
     * At 400 this was shorter than the two lines the archive shows collapsed
     * plus a little, so expanding a row gained the reader almost nothing. The
     * longest synopsis in the feed today runs to about 2,100 characters and
     * the median to 1,100, so nothing real is cut here any more — the cap is
     * only a backstop against a description that turns out to be a transcript.
     * What keeps the sponsor reads and the credits out is `synopsis` picking a
     * block, not this number.
     */
    summary: synopsis(item.description).slice(0, 3000),
    publishedAt: new Date(item.pubDate).toISOString(),
    durationSeconds: toSeconds(item['itunes:duration']),
    episode: item['itunes:episode'] ? Number(item['itunes:episode']) : undefined,
    season: item['itunes:season'] ? Number(item['itunes:season']) : undefined,
    image: item['itunes:image']?.['@_href'] ?? fallbackImage,
    audioUrl: item.enclosure?.['@_url'],
    url: item.link,
  }))
}

/**
 * Every video on a channel, not just the fifteen the RSS feed carries.
 *
 * YouTube's `feeds/videos.xml` is capped at fifteen entries with no paging,
 * which is fine for the main channel — the podcast RSS is the real archive
 * there and the videos are only matched against it — but the cuts channel has
 * no other source, so the site was showing fifteen of its twenty-two videos
 * and calling that the channel.
 *
 * So: read the channel's own /videos page, which ships its listing as JSON in
 * `ytInitialData`, and follow the continuation tokens with the same InnerTube
 * call the page itself makes when you scroll. That gives every id in the
 * order the channel lists them. The listing does not carry a description or a
 * real date — only "há 11 meses" — so each video is then read once from its
 * watch page, where `ytInitialPlayerResponse` has the exact publish date, the
 * length in seconds, the view count and the full description.
 *
 * This is someone else's page and its shape is theirs to change, so every step
 * fails soft: `videos` returns null if the listing cannot be read, and the
 * caller falls back to the RSS feed. Between the two, the section always has
 * something to show.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

async function getPage(url, init) {
  const response = await fetch(url, {
    ...init,
    headers: { 'User-Agent': BROWSER_UA, 'Accept-Language': 'pt-BR,pt;q=0.9', ...init?.headers },
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${url}`)
  return response.text()
}

/** Every value under `key`, anywhere in an InnerTube tree. */
function collect(node, key, out = []) {
  if (Array.isArray(node)) {
    for (const child of node) collect(child, key, out)
    return out
  }
  if (!node || typeof node !== 'object') return out
  for (const [name, value] of Object.entries(node)) {
    if (name === key) out.push(value)
    collect(value, key, out)
  }
  return out
}

/** The video ids in a listing response, in the order the channel lists them. */
function lockupIds(tree) {
  return collect(tree, 'lockupViewModel')
    .filter((lockup) => lockup.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO' && lockup.contentId)
    .map((lockup) => lockup.contentId)
}

/** The token for the next screenful, if the listing has one. */
function continuation(tree) {
  for (const item of collect(tree, 'continuationItemRenderer')) {
    const token = item.continuationEndpoint?.continuationCommand?.token
    if (token) return token
  }
  return null
}

/** One video, read from its own watch page. */
async function watch(id) {
  const html = await getPage(`https://www.youtube.com/watch?v=${id}`)
  const match = html.match(/var ytInitialPlayerResponse = (\{[\s\S]*?\});\s*(?:var|<\/script>)/)
  if (!match) return null

  const response = JSON.parse(match[1])
  const details = response.videoDetails ?? {}
  const card = response.microformat?.playerMicroformatRenderer ?? {}
  const published = card.publishDate ?? card.uploadDate
  if (!details.title || !published) return null

  const views = Number(details.viewCount)

  return {
    id,
    title: trimTitle(plain(details.title)),
    summary: synopsis(details.shortDescription),
    publishedAt: new Date(published).toISOString(),
    durationSeconds: toSeconds(details.lengthSeconds),
    views: Number.isFinite(views) ? views : undefined,
    url: `https://www.youtube.com/watch?v=${id}`,
    // maxresdefault 404s on some uploads; hqdefault always exists.
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  }
}

/** Runs `job` over `items` a few at a time, so 22 watch pages are not 22 at once. */
async function pooled(items, size, job) {
  const results = []
  for (let start = 0; start < items.length; start += size) {
    results.push(...(await Promise.all(items.slice(start, start + size).map(job))))
  }
  return results
}

async function channelVideos(channelId) {
  let ids
  try {
    const html = await getPage(`https://www.youtube.com/channel/${channelId}/videos`)
    const key = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1]
    const version = html.match(/"clientVersion":"([\d.]+)"/)?.[1]
    const first = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/)?.[1]
    if (!key || !version || !first) throw new Error('a página do canal mudou de forma')

    const tree = JSON.parse(first)
    const seen = new Set(lockupIds(tree))
    let token = continuation(tree)

    // The bound is a runaway guard, not a limit on the channel: each round is
    // about thirty videos, so this is roughly a thousand before it gives up.
    for (let round = 0; round < 32 && token; round += 1) {
      const body = JSON.stringify({
        context: { client: { clientName: 'WEB', clientVersion: version, hl: 'pt', gl: 'BR' } },
        continuation: token,
      })
      const next = JSON.parse(
        await getPage(`https://www.youtube.com/youtubei/v1/browse?key=${key}&prettyPrint=false`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        }),
      )
      const before = seen.size
      for (const id of lockupIds(next)) seen.add(id)
      token = continuation(next)
      if (seen.size === before) break
    }

    ids = [...seen]
  } catch (error) {
    console.warn(`  ! listagem do canal ${channelId}: ${error.message}`)
    return null
  }

  const videos = (await pooled(ids, 5, (id) => watch(id).catch(() => null))).filter(Boolean)
  if (videos.length === 0) return null

  // Newest first, like every other listing on the site. The channel page is
  // already in this order, but the watch pages come back out of order and the
  // date is the only thing that actually decides it.
  return videos.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
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

/**
 * Writes a source file, unless the fetch came back with nothing.
 *
 * The whole reason these files are committed is that the site should degrade
 * to the last known good data rather than to an empty page. Overwriting a
 * good file with `[]` is the one way this script can take that away, and it
 * is not hypothetical: the store scrape reads someone else's storefront, and
 * the day they rename a collection it returns zero products and the Loja
 * section renders empty. An empty result is a fetch that failed, not a source
 * that emptied — the fix belongs in the scraper, and until it lands the file
 * on disk is better than what just came back.
 */
async function write(name, data) {
  if (data.length === 0) {
    console.warn(`  ! ${name}.json — nada retornou, mantendo o arquivo atual`)
    return
  }
  await writeFile(resolve(OUT, `${name}.json`), `${JSON.stringify(data, null, 2)}\n`)
  console.log(`  ${name}.json — ${data.length} itens`)
}

await mkdir(OUT, { recursive: true })
console.log('buscando fontes externas…')

const [episodes, videos, scrapedCuts, rssCuts, products] = await Promise.all([
  podcast(),
  youtube(CHANNELS.main),
  channelVideos(CHANNELS.cuts),
  youtube(CHANNELS.cuts),
  store(),
])

/* The whole cuts channel where the scrape worked, the RSS feed's fifteen where
   it did not. Both are asked for every time rather than the second only on
   failure: the RSS call is one cheap request and having it in hand is what
   makes the fallback silent. */
const cuts = scrapedCuts ?? rssCuts
if (!scrapedCuts) console.warn('  ! cortes: usando o RSS (15 de ~22)')

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
