import { Sticker } from '@bunkerx/design-system'
import { MEMBERSHIP } from '../content/site'

/**
 * Two membership routes, both real. YouTube is the one most people arrive
 * looking for; Orelo is the one the hosts call "nossa preferência" in every
 * episode description, so it sits alongside rather than buried.
 */
export function Join() {
  return (
    <section className="block" id="membro">
      <div className="shell">
      <div className="join">
        <Sticker name="all-seeing-eye" width="clamp(8rem, 18vw, 15rem)" className="join__eye" />
        {/* The one place a taped line is used for what it says: it is the
            argument the section is making. */}
        <Sticker name="tape-not-alone" width="clamp(9rem, 22vw, 17rem)" className="join__tape" />
        <div>
          <h2 className="join__title">Entre para o bunker</h2>
          <p className="join__text">
            Apoiar o programa dá acesso ao conteúdo antes de ir ao ar e mantém a investigação de
            pé. Os dois caminhos levam ao mesmo lugar — o Orelo é o preferido da dupla.
          </p>
        </div>
        <div className="join__actions">
          <a
            className="action action--primary"
            href={MEMBERSHIP.orelo}
            target="_blank"
            rel="noreferrer noopener"
          >
            Apoiar pelo Orelo
          </a>
          <a
            className="action action--ghost"
            href={MEMBERSHIP.youtube}
            target="_blank"
            rel="noreferrer noopener"
          >
            Ser membro no YouTube
          </a>
        </div>
      </div>
      </div>
    </section>
  )
}
