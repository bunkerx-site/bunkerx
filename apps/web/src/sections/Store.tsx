import { Block } from './Block'
import { formatPrice } from '../lib/format'
import type { Product } from '../lib/types'

const STORE_URL = 'https://montink.com/bunker-x/'

export function Store({ products }: { products: Product[] }) {
  return (
    <Block
      id="loja"
      title="Loja"
      tone="deep"
      sticker="sketch-grey"
      stickerRotate={-5}
      lead="Estampas do programa. A produção e a entrega ficam com a Montink."
      more={
        <a
          className="action action--ghost"
          href={STORE_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          Ver as {products.length} peças
        </a>
      }
    >
      <div className="goods">
        {products.slice(0, 6).map((product) => (
          <a
            className="good"
            key={product.id}
            href={product.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="good__frame">
              <img src={product.image} alt={product.name} loading="lazy" />
            </div>
            <span className="good__name">{product.name}</span>
            <span className="good__price">{formatPrice(product.price)}</span>
          </a>
        ))}
      </div>
    </Block>
  )
}
