import { Band, Grid, MediaCard, Button, formatPrice } from '@bunkerx/design-system'
import { CHANNELS } from '../content/site'
import type { Product } from '../lib/types'

export function Store({ products }: { products: Product[] }) {
  return (
    <Band
      id="loja"
      title="Loja"
      tone="deep"
      sticker="sketch-grey"
      stickerRotate={-5}
      stickerMotion="sway"
      stickerHalo="lift"
      lead="Estampas do programa, para sair por aí sinalizando. Produção e entrega por conta da Montink."
      more={
        <Button variant="outline" href={CHANNELS.store} external>
          Ver as {products.length} peças
        </Button>
      }
    >
      <Grid min="16rem" gap="tight" fill>
        {products.slice(0, 6).map((product) => (
          <MediaCard
            key={product.id}
            href={product.url}
            title={product.name}
            /* A catalogue name is a label on a thing, not a headline. */
            face="body"
            note={formatPrice(product.price)}
            noteTone="accent"
            src={product.image}
            /* The one place a picture identifies the item on its own, so it
               carries real alt text. */
            alt={product.name}
            ratio="1"
          />
        ))}
      </Grid>
    </Band>
  )
}
