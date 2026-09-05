import { Background, CrtScreen, Seam } from '@bunkerx/design-system'
import { SiteHeader } from './sections/SiteHeader'
import { Fold } from './sections/Fold'
import { Episodes } from './sections/Episodes'
import { Cuts } from './sections/Cuts'
import { Agents } from './sections/Agents'
import { Store } from './sections/Store'
import { Join } from './sections/Join'
import { Listen } from './sections/Listen'
import { SignOff } from './sections/SignOff'
import { SiteFooter } from './sections/SiteFooter'
import episodes from './data/episodes-latest.json'
import cuts from './data/cuts.json'
import products from './data/products.json'
import { SECTION } from './content/site'
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

      <main id={SECTION.top}>
        <Fold episode={EPISODES[0]} />
        {/* The newest episode is the entire fold, so the log starts at the
            second one rather than repeating it immediately underneath. */}
        <Episodes episodes={EPISODES.slice(1)} />
        {/* There is no separate "No vídeo" block any more: eleven of the
            fifteen uploads on the main channel are episodes, and the archive
            above now carries every episode's video alongside its audio. The
            cuts are a different channel and a different thing, so they keep
            their own section — and their own surface. */}
        <Cuts videos={CUTS} />

        {/*
          The break between two sections, and it belongs to neither of them.

          Every other burst on the page is a band's own top edge: indented to
          the content column, saying where the column begins as well as that
          the signal has started again. These two say something else — that one
          section has ended and another has started — and a boundary cannot be
          drawn from inside one of the two things it separates. So they sit in
          the flow between the bands, pulled back by half their height so they
          take no space of their own and land on the join itself, half over the
          section above and half over the one below.

          A band clips, which is exactly why this cannot live inside one.
        */}
        <Seam inline className="band-break" />

        <Agents />

        <Seam inline className="band-break" />

        <Store products={PRODUCTS} />
        <Listen />
        {/* The ask goes last, right before the sign-off.
            Everything above it is the programme — where to find it, who makes
            it, what you can buy, where to press play. Asking someone to pay
            for it before they have been told where to listen was asking early;
            here it is the last thing on the page, which is where a request
            belongs once the case for it has been made. */}
        <Join />
        <SignOff />
      </main>

      <SiteFooter />
    </CrtScreen>
  )
}
