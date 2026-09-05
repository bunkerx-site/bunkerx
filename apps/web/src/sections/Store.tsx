import { Band, Button, Static, formatPrice } from '@bunkerx/design-system'
import { CHANNELS, SECTION } from '../content/site'
import type { Product } from '../lib/types'

/**
 * The shop's own shelves, in the order the board reads them.
 *
 * The keys are Montink's collection slugs, which is what the scraper writes
 * into each product — see scripts/fetch-feeds.mjs. Kept as a list rather than
 * derived from the data so the order is a decision: the shirts are what the
 * shop is mostly made of and they go first, the agents' uniform is the thing
 * the show itself wears, and everything that is not clothing comes last.
 *
 * A product whose collection is not on this list still appears, under the last
 * shelf, rather than vanishing from the board. A shop that quietly stops
 * showing a product because somebody renamed a collection is worse than one
 * that files it in the wrong place.
 */
const SHELVES = [
  { slug: 'camisas', label: 'Camisas' },
  { slug: 'itens-do-agente-bunker-x', label: 'Uniforme dos agentes' },
  { slug: 'outros-produtos', label: 'Fora do armário' },
] as const

/** Six dots is a row; past that the tag says how many more there are. */
const SWATCHES = 6

/**
 * One piece, pinned to the board.
 *
 * A print, on the same paper stock the cuts are mounted on: photograph at the
 * top, wide margin along the bottom, and what the shop knows about the piece
 * written in that margin. It is the material the site already uses for a
 * photograph lying on a bright surface, and a product shot is exactly that.
 *
 * The tag carries what a person actually decides on — what it costs, what
 * colours it comes in, what sizes are cut — and all three come from the shop
 * itself. None of it was available on the card this replaced, which meant the
 * only way to find out whether a shirt existed in your size was to leave the
 * site.
 */
function Piece({ product }: { product: Product }) {
  const swatches = product.colors.slice(0, SWATCHES)
  const hidden = product.colors.length - swatches.length

  return (
    /* `bx-hoverable` lights the panel from out here, so the whole piece
       answers the cursor rather than just the photograph. */
    <article className="piece bx-hoverable">
      {/*
        The same paper the cuts are printed on, and the same tape holding it
        down — see `.print` and `.tape`. Both sections put a photograph on a
        bright plate as an object lying on the surface rather than as a picture
        in a box, and they are meant to read as the same hand: what tells them
        apart is what is written in the margin and how they hang.
      */}
      <div className="piece__print print">
        {/* Taped down, the same way the cuts are. It is the same gesture
            because it is the same act: somebody put this up by hand. */}
        <span className="piece__tape tape" aria-hidden="true" />

        {/*
          The photograph is a link but is out of the tab order and hidden from
          assistive technology: it points where the name points, and a second
          stop on the same destination is noise to anyone not using a mouse.
        */}
        <a
          className="piece__shot"
          href={product.url}
          target="_blank"
          rel="noreferrer noopener"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            className="piece__image"
            src={product.image}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* Written in the margin, the way the cuts write the date and the
            running time — but a shop's margin carries what you decide on: what
            it costs, what colours it is cut in, what sizes exist. */}
        <div className="piece__tag">
          <h4 className="piece__name">
            <a href={product.url} target="_blank" rel="noreferrer noopener">
              {product.name}
            </a>
          </h4>

          <p className="piece__price">{formatPrice(product.price)}</p>

          {product.colors.length > 0 ? (
            <p className="piece__colors">
              <span className="bx-visually-hidden">
                Cores: {product.colors.map((colour) => colour.name).join(', ')}.
              </span>
              {swatches.map((colour) => (
                <span
                  key={colour.name}
                  className="piece__swatch"
                  style={{ background: colour.hex }}
                  aria-hidden="true"
                />
              ))}
              {hidden > 0 ? (
                <span className="piece__swatch-rest" aria-hidden="true">
                  +{hidden}
                </span>
              ) : null}
            </p>
          ) : null}

          {product.sizes.length > 0 ? (
            <p className="piece__sizes">
              <span className="bx-visually-hidden">Tamanhos: </span>
              {product.sizes.map((size) => (
                <span className="piece__size" key={size}>
                  {size}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

/**
 * The shop: a board with the stock pinned to it.
 *
 * The second plate on the site, and it is the same green on purpose — this is
 * the other place where you are not watching the programme, you are handling
 * something it made. What is different is what is on the surface. The cuts
 * stand equipment on their plate and tape photographs to it; the shop pins its
 * stock up at uneven heights the way anything ever pinned to a real board
 * ends up, and every piece carries a tag.
 *
 * Everything the shop knows is now on the board. The old section showed six
 * products as identical cards with a name and a price, while the scraper had
 * been collecting colours, sizes and which collection each piece belongs to
 * and throwing all of it away. Fifteen pieces on three shelves, each with its
 * palette and its size run, is the section doing the job a shop front does:
 * you can tell from here whether the shirt comes in your size.
 */
export function Store({ products }: { products: Product[] }) {
  const known: Set<string> = new Set(SHELVES.map((shelf) => shelf.slug))

  const shelves = SHELVES.map((shelf, index) => ({
    ...shelf,
    products: products.filter(
      (product) =>
        product.collection === shelf.slug ||
        /* Anything from a collection this list does not know about lands on
           the last shelf rather than disappearing. */
        (index === SHELVES.length - 1 && !known.has(product.collection)),
    ),
  })).filter((shelf) => shelf.products.length > 0)

  return (
    <Band
      id={SECTION.store}
      className="store plate"
      /* The mascot stands up over the join with the section above, and a band
         clips by default — which would cut it off exactly at the edge it is
         supposed to cross. Nothing else in here leaves the box, and `main`
         clips sideways so the bleed to the right still cannot open a
         horizontal scrollbar. */
      overflow
      title="Loja"
      /* The burst above this band is rendered between the two sections rather
         than on this one's edge — see App.tsx. */
      seam={false}
      lead="Estampas do programa, para sair por aí sinalizando. Produção e entrega por conta da Montink."
      /* The plate is the one flat colour on a page that is otherwise a
         starfield, and flat is the one thing this design is not. The grain
         gives it the tooth every other surface gets from the sky behind it. */
      layer={
        <div className="plate__grain" aria-hidden="true">
          <Static intensity={0.35} fps={8} grain={3} />
        </div>
      }
      more={
        <div className="cta">
          <p className="cta__pitch">
            A loja é da Montink: o pagamento, o tamanho escolhido e a entrega acontecem lá. Cada
            peça abre direto na página dela.
          </p>
          <Button variant="outline" href={CHANNELS.store} external>
            Ver a loja completa
          </Button>
        </div>
      }
    >
      {/*
        The shop's mascot, standing on the plate.

        It holds the merchandise up, which is the one thing a picture in a shop
        front is for — and it is the same grey the sticker sheet has been
        drawing since the first band on the page, in the shirts this section is
        selling. Decorative: everything it is showing is on the board below it
        as a real product with a real link.
      */}
      <img
        className="store__mascot"
        src="/decor/et-store.png"
        alt=""
        aria-hidden="true"
        width={600}
        height={900}
        loading="lazy"
        decoding="async"
        draggable={false}
      />

      <div className="store__board">
        {shelves.map((shelf) => (
          <section className="shelf" key={shelf.slug}>
            <h3 className="shelf__label">
              {shelf.label}
              <span className="shelf__count">{shelf.products.length}</span>
            </h3>

            <div className="shelf__grid">
              {shelf.products.map((product) => (
                <Piece key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Band>
  )
}
