import { Block } from './Block'
import { PLATFORMS } from '../content/site'

export function Listen() {
  return (
    <Block
      id="ouvir"
      title="Onde ouvir"
      tone="nebula"
      lead="Um feed só, distribuído em todas elas. Escolha a sua."
    >
      <div className="outlets">
        {PLATFORMS.map((platform) => (
          <a
            className="outlet"
            key={platform.label}
            href={platform.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {platform.label}
          </a>
        ))}
      </div>
    </Block>
  )
}
