import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  Field,
  Frame,
  Glitch,
  Grid,
  Icon,
  Lamp,
  Log,
  LogEntry,
  MediaCard,
  Panel,
  PlatformIcon,
  Plate,
  Seam,
  Select,
  Stamp,
  Static,
  Textarea,
  Tile,
} from '../index'

/*
 * The showroom is a document about the system, not a screen built out of it,
 * so its prose and layout use its own stylesheet rather than components. It
 * used to lean on a set of primitives — Heading, Text, Stack — that the site
 * itself never adopted; those are gone, and this reads more plainly without
 * them.
 */
import './Showroom.css'

const meta: Meta = {
  title: 'Showroom',
  parameters: { layout: 'fullscreen', docs: { disable: true } },
}
export default meta

type Story = StoryObj

const SIGNAL_COLOURS = [
  ['--bx-phosphor', '#00ed67', 'BRAND. Ações, foco, qualquer coisa viva.'],
  ['--bx-purple', '#633693', 'BRAND. Superfícies e blocos elevados.'],
  ['--bx-void-deep', '#0e0716', 'O roxo levado quase ao preto: o chão.'],
  ['--bx-void', '#170e23', 'Um degrau acima: o interior do bunker.'],
  ['--bx-nebula-soft', '#7d4bb3', 'Elevação sobre o roxo.'],
  ['--bx-phosphor-hot', '#6bffa6', 'O verde levantado. Só hover e ênfase.'],
  ['--bx-phosphor-dim', '#0a8f42', 'O verde derrubado. Estado inativo.'],
  ['--bx-magenta', '#c974e0', 'Erro de convergência. Nunca sozinho.'],
  ['--bx-signal', '#f2ecff', 'Branco-estrela. Texto principal.'],
  ['--bx-alert', '#ff4438', 'Lâmpada de alerta. Só erro.'],
]

function Swatch({ name, value, use }: { name: string; value: string; use: string }) {
  return (
    <div className="sr-swatch">
      <div className="sr-swatch__chip" style={{ background: `var(${name})` }} />
      <div className="sr-swatch__meta">
        <div className="sr-swatch__name">{name.replace('--bx-', '')}</div>
        <div className="sr-swatch__value">{value}</div>
        <div className="sr-swatch__use">{use}</div>
      </div>
    </div>
  )
}

function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: ReactNode
}) {
  return (
    <section className="sr-section">
      <div className="sr-section__head">
        <h2 className="sr-section__title">{title}</h2>
        {note ? <span className="sr-section__note">{note}</span> : null}
      </div>
      {children}
    </section>
  )
}

export const Showroom: Story = {
  render: () => (
    <div className="sr">
      <header className="sr-hero">
        <div className="sr-hero__noise">
          <Static intensity={0.3} />
        </div>
        <div className="sr-hero__inner">
          <Glitch as="div" offset="break" className="sr-hero__wordmark">
            BUNKER X
          </Glitch>
          <div className="sr-hero__tagline">design system · v0.1.0</div>
        </div>
      </header>

      <Section title="Cor" note="#00ED67 e #633693 são a marca; o resto é derivado">
        <p className="sr-note">
          Duas cores são a marca e não se discutem: o verde #00ED67 e o roxo #633693. Todo o
          resto sai delas — os fundos são o roxo levado ao preto, os tons são as duas escurecidas
          ou clareadas. O verde só aparece onde algo está vivo: ação, foco, estado ligado.
        </p>
        <div className="sr-grid sr-grid--swatches" style={{ marginTop: 'var(--bx-space-6)' }}>
          {SIGNAL_COLOURS.map(([name, value, use]) => (
            <Swatch key={name} name={name} value={value} use={use} />
          ))}
        </div>
      </Section>

      <Section title="Tipografia" note="Bunker X · New Order · VCR OSD Mono">
        <div className="sr-type__row">
          <span className="sr-type__tag">display 5xl</span>
          <h2 className="sr-type__sample sr-type__sample--display-1">Oumuamua não era pedra</h2>
        </div>
        <div className="sr-type__row">
          <span className="sr-type__tag">display 3xl</span>
          <h3 className="sr-type__sample sr-type__sample--display-3">
            Os OVNIs que cruzaram a Lua
          </h3>
        </div>
        <div className="sr-type__row">
          <span className="sr-type__tag">body md</span>
          <p className="sr-type__sample sr-type__body">
            Vista seu capacete de alumínio e venha desvendar as investigações.
          </p>
        </div>
        <div className="sr-type__row">
          <span className="sr-type__tag">body sm mute</span>
          <p className="sr-note sr-type__sample">
            Publicado em 28 de agosto · 1h12min · três plataformas
          </p>
        </div>
        <div className="sr-type__row">
          <span className="sr-type__tag">mono xs</span>
          <p className="sr-note sr-note--mono sr-type__sample">
            nº 174 — transmissão encerrada
          </p>
        </div>
      </Section>

      <Section title="Má convergência" note="o mecanismo de ênfase do sistema">
        <p className="sr-note">
          No lugar de uma cor de destaque, o sistema usa o defeito de um CRT que perdeu o
          alinhamento dos canhões RGB. Gaste isso em um elemento por tela.
        </p>
        <div className="sr-stack" style={{ gap: 'var(--bx-space-6)',  marginTop: 'var(--bx-space-6)'  }}>
          <Glitch offset="none" as="div" style={{ fontSize: 'var(--bx-text-3xl)' }}>
            sinal limpo
          </Glitch>
          <Glitch offset="nudge" as="div" style={{ fontSize: 'var(--bx-text-3xl)' }}>
            leve deriva
          </Glitch>
          <Glitch offset="break" as="div" style={{ fontSize: 'var(--bx-text-3xl)' }}>
            fora de sintonia
          </Glitch>
          <Glitch reactive as="div" style={{ fontSize: 'var(--bx-text-3xl)' }}>
            passe o mouse aqui
          </Glitch>
        </div>
      </Section>

      <Section title="Ações">
        <div className="sr-row">
          <Button variant="phosphor">Ouvir episódio</Button>
          <Button variant="outline">Ver todos</Button>
          <Button variant="quiet">Cancelar</Button>
          <Button variant="phosphor" disabled>
            Indisponível
          </Button>
        </div>
        <div className="sr-row" style={{ marginTop: 'var(--bx-space-4)' }}>
          <Button variant="outline" size="sm">
            Pequeno
          </Button>
          <Button variant="outline">Médio</Button>
          <Button variant="outline" href="#" external>
            Como um link
          </Button>
        </div>
      </Section>

      <Section title="Formulário" note="cantos retos: só o que é carimbado tem raio">
        <div className="sr-grid sr-grid--two">
          <div className="sr-stack" style={{ gap: 'var(--bx-space-6)' }}>
            <Field label="Seu e-mail" placeholder="agente@bunkerx.com.br" type="email" />
            <Field
              label="Código de acesso"
              defaultValue="XK-0042"
              error="Código não reconhecido. Confira as quatro letras iniciais."
            />
            <Select
              label="Plataforma preferida"
              options={[
                { label: 'Spotify', value: 'spotify' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Apple Podcasts', value: 'apple' },
              ]}
              hint="Usamos isso só para escolher o link padrão."
            />
          </div>
          <div className="sr-stack" style={{ gap: 'var(--bx-space-6)' }}>
            <Textarea label="Conte seu avistamento" placeholder="Data, hora, o que você viu…" />
            <Checkbox label="Quero receber aviso de episódio novo" defaultChecked />
            <Checkbox label="Aceito ser abduzido em horário comercial" />
          </div>
        </div>
      </Section>

      <Section title="Superfícies">
        <div className="sr-grid sr-grid--two">
          <Panel marked>
            <h3 className="sr-panel__title">Elevado</h3>
            <p className="sr-note" style={{ marginTop: 'var(--bx-space-2)' }}>
              Fundo e borda próprios. As marcas de canto são de registro de impressão — dizem que o
              quadro é um recorte deliberado, não um card com borda.
            </p>
          </Panel>
          <Panel tone="flat" marked>
            <h3 className="sr-panel__title">Plano</h3>
            <p className="sr-note" style={{ marginTop: 'var(--bx-space-2)' }}>
              Só o contorno, sem pintar. Para quando o painel já está sobre uma superfície e um
              segundo fundo viraria sujeira.
            </p>
          </Panel>
        </div>
        <div className="sr-row" style={{ marginTop: 'var(--bx-space-6)' }}>
          <Stamp tone="open">Em apuração</Stamp>
          <Stamp tone="closed">Encerrado</Stamp>
        </div>
      </Section>

      <Section title="Apresentadores">
        <div className="sr-row">
          <Avatar src="/hosts/affonso-solano.png" name="Affonso Solano" size={140} showName />
          <Avatar src="/hosts/afonso-3d.png" name="Afonso 3D" size={140} showName />
        </div>
        <p className="sr-note sr-note--xs" style={{ marginTop: 'var(--bx-space-3)' }}>
          Monitor de vigilância: dessaturado e com varredura, volta a cor quando você olha direto.
        </p>
      </Section>

      <Section title="Estrutura" note="o que divide e o que agrupa">
        <p className="sr-note">
          O seam é o corte entre seções: uma corrida curta de barras de test card e uma régua
          saindo até a borda. Em escala menor ele separa itens dentro de uma seção; sobre a placa
          verde ele inverte, porque quatro das sete barras são verdes e barra verde em chão verde
          não é barra.
        </p>
        <div style={{ marginTop: 'var(--bx-space-6)', display: 'grid', gap: 'var(--bx-space-6)' }}>
          <Seam inline />
          <Seam inline size="sm" />
          <Plate style={{ padding: 'var(--bx-space-6)' }}>
            <Seam inline tone="plate" />
          </Plate>
        </div>
      </Section>

      <Section title="Plataformas" note="marcas reais; waveform onde não existe uma">
        <div className="sr-row">
          {(['spotify', 'youtube', 'apple-podcasts', 'amazon-music', 'orelo', 'rss'] as const).map(
            (name) => (
              <Tile key={name} size="sm" icon={name} href="#">
                {name}
              </Tile>
            ),
          )}
        </div>
        <p className="sr-note sr-note--xs" style={{ marginTop: 'var(--bx-space-3)' }}>
          Amazon e Orelo não têm marca disponível — a primeira foi retirada do conjunto, a segunda
          é pequena demais para estar nele — e caem no waveform do sistema. Um logo errado é pior
          que nenhum.
        </p>
      </Section>

      <Section title="Ações do sistema" note="glifos próprios, não marcas de empresa">
        <div className="sr-row">
          <Button variant="outline">
            <Icon name="archive" size="1.15em" />
            Ver todos os episódios
          </Button>
          <Button variant="outline">
            <Icon name="signal" size="1.15em" />
            Apoie o programa
          </Button>
          <Button variant="phosphor" href="#" external>
            <PlatformIcon name="youtube" size="1.15em" />
            Assistir no YouTube
          </Button>
        </div>
      </Section>

      <Section title="Estado e dados">
        <div className="sr-row">
          <Chip>
            <time dateTime="2026-08-28">28 de ago. de 2026</time>
            <span>1h39</span>
          </Chip>
          <Plate style={{ padding: 'var(--bx-space-4) var(--bx-space-6)' }}>
            <Lamp>Toda segunda, 20h</Lamp>
          </Plate>
        </div>
      </Section>

      <Section title="Mídia" note="um quadro, e o card que o usa">
        <Grid min="17rem" gap="tight">
          <Frame src="/brand/logo-bunkerx.jpg" ratio="16 / 9" fit="contain" scan glow />
          <MediaCard
            href="#"
            external={false}
            title="Os OVNIs que cruzaram a Lua"
            note="06 de ago. de 2026"
            src="/brand/logo-bunkerx.jpg"
            ratio="16 / 9"
            scan
            glow
          />
        </Grid>
      </Section>

      <Section title="Arquivo" note="uma linha do log, com a descrição colapsada">
        <Log>
          <LogEntry
            title="Nazistas e aliens: o pacto secreto do Terceiro Reich"
            href="#"
            publishedAt="2026-08-28T12:00:00Z"
            durationSeconds={5950}
            artwork="/brand/logo-bunkerx.jpg"
            artworkFits={false}
            summary="Um oficial da Força Aérea diz ter visto os documentos. A gente foi atrás de cada um deles — e do que sobrou depois que a papelada sumiu. O episódio percorre o que foi publicado, o que foi desmentido e o que nunca teve resposta."
            actions={
              <Button variant="outline" size="sm">
                <PlatformIcon name="spotify" size="1.1em" />
                Ouvir
              </Button>
            }
          />
        </Log>
      </Section>

      <hr className="sr-rule" />

      <Section title="Texto e links">
        <p className="sr-body">
          O corpo do texto usa Barlow, uma grotesca institucional — quase de placa de repartição
          pública. Ela segura o clima de bunker sem cobrar legibilidade, e tem acentuação completa
          para o português.
        </p>
      </Section>
    </div>
  ),
}
