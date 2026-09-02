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
        <div>
          <h2 className="join__title">Entre para o bunker</h2>
          <p className="join__text">
            Apoiar o programa dá acesso ao conteúdo antes de ir ao ar e mantém a investigação de
            pé. Os dois caminhos levam ao mesmo lugar — o Orelo é o preferido da dupla.
          </p>
        </div>
        <div className="join__actions">
          <a
            className="fold__action fold__action--primary"
            href={MEMBERSHIP.orelo}
            target="_blank"
            rel="noreferrer noopener"
          >
            Apoiar pelo Orelo
          </a>
          <a
            className="fold__action fold__action--ghost"
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
