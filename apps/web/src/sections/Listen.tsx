import { Tile } from '@bunkerx/design-system'
import { Block } from './Block'
import { PLATFORMS } from '../content/site'

export function Listen() {
  return (
    <Block
      id="ouvir"
      title="Onde ouvir"
      tone="nebula"
      stickerSide="left"
      sticker="radio-dishes"
      stickerRotate={4}
      lead="Um feed só, distribuído em todas elas. Escolha a sua."
    >
      {/* The same component as the chips in the fold, at full rank. Here the
          six links are the whole point of the section, so they get plates you
          aim at rather than a quiet row. */}
      <div className="outlets">
        {PLATFORMS.map((platform) => (
          <Tile key={platform.label} icon={platform.icon} href={platform.href}>
            {platform.label}
          </Tile>
        ))}
      </div>
    </Block>
  )
}
