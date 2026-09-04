import { Background, CrtScreen } from '@bunkerx/design-system'
import { SiteHeader } from './sections/SiteHeader'
import { Fold } from './sections/Fold'
import { Episodes } from './sections/Episodes'
import { Watch } from './sections/Watch'
import { Agents } from './sections/Agents'
import { Bulletin } from './sections/Bulletin'
import { Store } from './sections/Store'
import { Join } from './sections/Join'
import { Listen } from './sections/Listen'
import { SignOff } from './sections/SignOff'
import { SiteFooter } from './sections/SiteFooter'
import episodes from './data/episodes-latest.json'
import cuts from './data/cuts.json'
import products from './data/products.json'
import type { Episode, Product, Video } from './lib/types'
import './styles/site.css'

/**
 * Every source is fetched at build time and imported as JSON, so the page
 * renders with no network call of its own. See scripts/fetch-feeds.mjs.
 *
 * The episodes import is the trimmed slice, not the 174-entry archive: this
 * page shows six, and the full file is there for an episode index that does
 * not exist yet.
 */
const EPISODES = episodes as Episode[]
const CUTS = cuts as Video[]
const PRODUCTS = products as Product[]

export function App() {
  return (
    <CrtScreen>
      <Background />
      <SiteHeader />

      <main id="topo">
        <Fold episode={EPISODES[0]} />
        {/* The newest episode is the entire fold, so the log starts at the
            second one rather than repeating it immediately underneath. */}
        <Episodes episodes={EPISODES.slice(1)} />
        {/* There is no separate "No vídeo" block any more: eleven of the
            fifteen uploads on the main channel are episodes, and the archive
            above now carries every episode's video alongside its audio. The
            cuts are a different channel and a different thing, so they keep
            their own section. */}
        <Watch
          id="cortes"
          title="Cortes"
          lead="Trechos soltos, para quem tem dez minutos."
          videos={CUTS}
          channelUrl="https://www.youtube.com/@CortesBunkerX"
          channelLabel="Ver o canal de cortes"
          sticker="night-vision"
          stickerMotion="handheld"
          stickerHalo="phosphor"
          tone="nebula"
          stickerSide="left"
          tight
          count={6}
        />
        <Agents />
        <Bulletin />
        <Store products={PRODUCTS} />
        <Join />
        <Listen />
        <SignOff />
      </main>

      <SiteFooter />
    </CrtScreen>
  )
}
