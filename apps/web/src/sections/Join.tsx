import { Band, Button, Panel, Sticker } from '@bunkerx/design-system'
import { MEMBERSHIP, SECTION } from '../content/site'

/**
 * Two membership routes, both real. YouTube is the one most people arrive
 * looking for; Orelo is the one the hosts call "nossa preferência" in every
 * episode description, so it sits alongside rather than buried.
 *
 * A band with no heading of its own: the panel inside carries one, and a
 * section title above it would say the same thing twice. Both the band and the
 * panel allow overflow, because the whole point of the two cut-outs is that
 * they hang over the panel's edges.
 */
export function Join() {
  return (
    <Band id={SECTION.membership} seam={false} overflow>
      <Panel ask overflow>
        <Sticker
          name="all-seeing-eye"
          width="clamp(8rem, 18vw, 15rem)"
          motion="watch"
          className="join__eye"
        />
        {/* The one place a taped line is used for what it says: it is the
            argument the section is making. */}
        <Sticker
          name="tape-not-alone"
          width="clamp(9rem, 22vw, 17rem)"
          rotate={-4}
          motion="sway"
          halo="lift"
          className="join__tape"
        />

        <div>
          <h2 className="join__title">Entre para o bunker</h2>
          <p className="join__text">
            Apoiar o programa dá acesso ao conteúdo antes de ir ao ar e mantém a investigação de
            pé. Os dois caminhos levam ao mesmo lugar — o Orelo é o preferido da dupla.
          </p>
        </div>

        <div className="join__actions">
          <Button variant="phosphor" href={MEMBERSHIP.orelo} external>
            Apoiar pelo Orelo
          </Button>
          <Button variant="outline" href={MEMBERSHIP.youtube} external>
            Ser membro no YouTube
          </Button>
        </div>
      </Panel>
    </Band>
  )
}
