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
import videos from './data/videos.json'
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
const VIDEOS = videos as Video[]
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
        <Watch
          id="videos"
          title="No vídeo"
          lead="O programa inteiro, com câmera, no canal principal."
          videos={VIDEOS}
          channelUrl="https://www.youtube.com/@bunkerx"
          channelLabel="Ver o canal no YouTube"
          sticker="camera"
          stickerSide="left"
          count={4}
        />
        <Watch
          id="cortes"
          title="Cortes"
          lead="Trechos soltos, para quem tem dez minutos."
          videos={CUTS}
          channelUrl="https://www.youtube.com/@CortesBunkerX"
          channelLabel="Ver o canal de cortes"
          sticker="night-vision"
          tone="nebula"
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
