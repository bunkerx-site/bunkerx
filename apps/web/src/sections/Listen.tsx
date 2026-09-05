import { Band, Grid, Tile } from '@bunkerx/design-system'
import { PLATFORMS } from '../content/site'

export function Listen() {
  return (
    <Band
      id="ouvir"
      title="Onde ouvir"
      tone="nebula"
      stickerSide="left"
      sticker="radio-dishes"
      stickerRotate={4}
      /* "e o episódio novo chega sem você procurar" is the archive's pitch and
         the cuts', and a third time here would be the page repeating its one
         argument at every scroll. This section's job is smaller: the choice is
         not between four shows, it is between four apps, and the right one is
         whichever is already installed. */
      lead="Um feed só, distribuído por todas elas. Escolha o app que você já usa."
    >
      {/* The same component as the chips in the fold, at full rank. Here the
          six links are the whole point of the section, so they get plates you
          aim at rather than a quiet row. */}
      <Grid min="15rem" gap="tight">
        {PLATFORMS.map((platform) => (
          <Tile key={platform.label} icon={platform.icon} href={platform.href}>
            {platform.label}
          </Tile>
        ))}
      </Grid>
    </Band>
  )
}
