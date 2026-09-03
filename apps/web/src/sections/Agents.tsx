import { Block } from './Block'
import { HOSTS } from '../content/site'

export function Agents() {
  return (
    <Block
      id="agentes"
      title="Quem investiga"
      tone="nebula"
      stickerSide="left"
      sticker="case-folder"
      stickerRotate={6}
      lead="Dois sujeitos que levam o assunto a sério o suficiente para rir dele."
    >
      <div className="agents">
        {HOSTS.map((host) => (
          <article className="agent" key={host.name}>
            <img
              className="agent__portrait"
              src={host.portrait}
              alt={`Retrato de ${host.name}`}
              width={208}
              height={208}
              loading="lazy"
            />
            <div>
              <h3 className="agent__name">{host.name}</h3>
              <p className="agent__bio">{host.bio}</p>
              <div className="agent__links">
                {host.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer noopener">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Block>
  )
}
