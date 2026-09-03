import { Sticker } from '@bunkerx/design-system'
import { MEMBERSHIP, NAV, PLATFORMS, SITE, SOCIALS } from '../content/site'

export function SiteFooter() {
  return (
    <footer className="footer">
      {/* Pressed across the seam: half of it on the dark, half on the plate.
          A sticker stuck over a join is the whole reason it reads as stuck on
          rather than laid out. */}
      <Sticker
        name="tape-look-up"
        width="clamp(8rem, 20vw, 14rem)"
        className="footer__tape"
      />

      <div className="shell">
        <div className="footer__grid">
          <div>
            <p className="footer__name">{SITE.name}</p>
            <p className="footer__blurb">
              {SITE.tagline}. {SITE.schedule}, com Affonso Solano e Afonso 3D.
            </p>
          </div>

          <div className="footer__group">
            <h3>Navegar</h3>
            <ul className="footer__list">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
              <li>
                <a href={MEMBERSHIP.orelo} target="_blank" rel="noreferrer noopener">
                  Apoiar
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__group">
            <h3>Ouvir</h3>
            <ul className="footer__list">
              {PLATFORMS.map((platform) => (
                <li key={platform.label}>
                  <a href={platform.href} target="_blank" rel="noreferrer noopener">
                    {platform.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__group">
            <h3>Seguir</h3>
            <ul className="footer__list">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer noopener">
                    {social.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>Feito num bunker, transmitido de segunda</span>
        </div>
      </div>
    </footer>
  )
}
