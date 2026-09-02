import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  EpisodeCard,
  Field,
  Glitch,
  Heading,
  Link,
  NoSignal,
  Panel,
  Select,
  Stack,
  Stamp,
  Static,
  Text,
  Textarea,
} from '../index'
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
        <Heading level={2} size={4}>
          {title}
        </Heading>
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
        <Text size="sm" tone="mute">
          Duas cores são a marca e não se discutem: o verde #00ED67 e o roxo #633693. Todo o
          resto sai delas — os fundos são o roxo levado ao preto, os tons são as duas escurecidas
          ou clareadas. O verde só aparece onde algo está vivo: ação, foco, estado ligado.
        </Text>
        <div className="sr-grid sr-grid--swatches" style={{ marginTop: 'var(--bx-space-6)' }}>
          {SIGNAL_COLOURS.map(([name, value, use]) => (
            <Swatch key={name} name={name} value={value} use={use} />
          ))}
        </div>
      </Section>

      <Section title="Tipografia" note="Bunker X · New Order · VCR OSD Mono">
        <div className="sr-type__row">
          <span className="sr-type__tag">display 5xl</span>
          <Heading level={2} size={1} className="sr-type__sample">
            Oumuamua não era pedra
          </Heading>
        </div>
        <div className="sr-type__row">
          <span className="sr-type__tag">display 3xl</span>
          <Heading level={3} size={3} className="sr-type__sample">
            Os OVNIs que cruzaram a Lua
          </Heading>
        </div>
        <div className="sr-type__row">
          <span className="sr-type__tag">body md</span>
          <Text className="sr-type__sample">
            Vista seu capacete de alumínio e venha desvendar as investigações.
          </Text>
        </div>
        <div className="sr-type__row">
          <span className="sr-type__tag">body sm mute</span>
          <Text size="sm" tone="mute" className="sr-type__sample">
            Publicado em 28 de agosto · 1h12min · três plataformas
          </Text>
        </div>
        <div className="sr-type__row">
          <span className="sr-type__tag">mono xs</span>
          <Text size="xs" mono tone="accent" className="sr-type__sample">
            nº 174 — transmissão encerrada
          </Text>
        </div>
      </Section>

      <Section title="Má convergência" note="o mecanismo de ênfase do sistema">
        <Text size="sm" tone="mute">
          No lugar de uma cor de destaque, o sistema usa o defeito de um CRT que perdeu o
          alinhamento dos canhões RGB. Gaste isso em um elemento por tela.
        </Text>
        <Stack gap={6} style={{ marginTop: 'var(--bx-space-6)' }}>
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
        </Stack>
      </Section>

      <Section title="Ações">
        <div className="sr-row">
          <Button variant="phosphor">Ouvir episódio</Button>
          <Button variant="outline">Ver todos</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="phosphor" disabled>
            Indisponível
          </Button>
        </div>
        <div className="sr-row" style={{ marginTop: 'var(--bx-space-4)' }}>
          <Button variant="outline" size="sm">
            Pequeno
          </Button>
          <Button variant="outline">Médio</Button>
          <Button variant="outline" size="lg">
            Grande
          </Button>
        </div>
      </Section>

      <Section title="Formulário" note="cantos retos: só o que é carimbado tem raio">
        <div className="sr-grid sr-grid--two">
          <Stack gap={6}>
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
          </Stack>
          <Stack gap={6}>
            <Textarea label="Conte seu avistamento" placeholder="Data, hora, o que você viu…" />
            <Checkbox label="Quero receber aviso de episódio novo" defaultChecked />
            <Checkbox label="Aceito ser abduzido em horário comercial" />
          </Stack>
        </div>
      </Section>

      <Section title="Superfícies">
        <div className="sr-grid sr-grid--two">
          <Panel marked>
            <Heading level={3} size={5}>
              Elevado
            </Heading>
            <Text size="sm" tone="mute" style={{ marginTop: 'var(--bx-space-2)' }}>
              Fundo e borda próprios. As marcas de canto são de registro de impressão — dizem que o
              quadro é um recorte deliberado, não um card com borda.
            </Text>
          </Panel>
          <Panel tone="flat" marked>
            <Heading level={3} size={5}>
              Plano
            </Heading>
            <Text size="sm" tone="mute" style={{ marginTop: 'var(--bx-space-2)' }}>
              Só o contorno, sem pintar. Para quando o painel já está sobre uma superfície e um
              segundo fundo viraria sujeira.
            </Text>
          </Panel>
        </div>
        <div className="sr-row" style={{ marginTop: 'var(--bx-space-6)' }}>
          <Stamp tone="classified">classificado</Stamp>
          <Stamp tone="verified">inédito</Stamp>
          <Stamp tone="archive">arquivo</Stamp>
        </div>
      </Section>

      <Section title="Apresentadores">
        <div className="sr-row">
          <Avatar src="/hosts/affonso-solano.png" name="Affonso Solano" size={140} showName />
          <Avatar src="/hosts/afonso-3d.png" name="Afonso 3D" size={140} showName />
        </div>
        <Text size="xs" tone="mute" style={{ marginTop: 'var(--bx-space-3)' }}>
          Monitor de vigilância: dessaturado e com varredura, volta a cor quando você olha direto.
        </Text>
      </Section>

      <Section title="Episódio">
        <Stack gap={4}>
          <EpisodeCard
            number={174}
            title="Nazistas e aliens: o pacto secreto do Terceiro Reich"
            href="#"
            summary="Um oficial da Força Aérea diz ter visto os documentos. A gente foi atrás de cada um deles — e do que sobrou depois que a papelada sumiu."
            publishedAt="2026-08-28T12:00:00Z"
            durationSeconds={4340}
            artworkUrl="/brand/logo-bunkerx.jpg"
            platforms={[
              { label: 'Spotify', href: '#' },
              { label: 'YouTube', href: '#' },
              { label: 'Apple', href: '#' },
            ]}
          />
          <EpisodeCard
            number={173}
            title="Os OVNIs que cruzaram a Lua"
            href="#"
            summary="Três registros, dois telescópios e uma explicação que ninguém quis assinar."
            publishedAt="2026-08-21T12:00:00Z"
            durationSeconds={3720}
            artworkUrl="/brand/logo-bunkerx.jpg"
            platforms={[{ label: 'Spotify', href: '#' }]}
          />
        </Stack>
      </Section>

      <Section title="Sem sinal" note="estado vazio e de erro">
        <NoSignal
          message="Nenhum episódio encontrado com esse termo. Tente outra palavra ou volte para a lista completa."
          action={<Button variant="outline">Ver todos os episódios</Button>}
        />
      </Section>

      <Divider />

      <Section title="Texto e links">
        <Text>
          O corpo do texto usa Barlow, uma grotesca institucional — quase de placa de repartição
          pública. Ela segura o clima de bunker sem cobrar legibilidade, e tem acentuação completa
          para o português.
        </Text>
        <Text>
          Links internos aparecem <Link href="#">assim</Link>, e os que saem do site{' '}
          <Link href="https://montink.com/bunker-x/" external>
            assim
          </Link>
          .
        </Text>
      </Section>
    </div>
  ),
}
