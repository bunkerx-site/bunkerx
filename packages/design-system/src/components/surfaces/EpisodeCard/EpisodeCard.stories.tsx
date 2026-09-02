import type { Meta, StoryObj } from '@storybook/react-vite'
import { EpisodeCard } from './EpisodeCard'
import { Stack } from '../../primitives/Stack/Stack'

const meta = {
  title: 'Surfaces/EpisodeCard',
  component: EpisodeCard,
  args: {
    number: 174,
    title: 'Nazistas e aliens: o pacto secreto do Terceiro Reich',
    href: '#',
    summary:
      'Um oficial da Força Aérea diz ter visto os documentos. A gente foi atrás de cada um deles — e do que sobrou depois que a papelada sumiu.',
    publishedAt: '2026-08-28T12:00:00Z',
    durationSeconds: 4340,
    artworkUrl: '/brand/logo-bunkerx.jpg',
    platforms: [
      { label: 'Spotify', href: '#' },
      { label: 'YouTube', href: '#' },
      { label: 'Apple', href: '#' },
    ],
  },
} satisfies Meta<typeof EpisodeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AudioOnly: Story = {
  name: 'Só áudio',
  parameters: {
    docs: {
      description: {
        story:
          'O RSS do YouTube só devolve os 15 vídeos mais recentes, então episódios antigos chegam sem par em vídeo. A presença da plataforma é a informação — a lista some quando não há nenhuma.',
      },
    },
  },
  args: {
    number: 12,
    title: 'O disco de Roswell e o memorando que ninguém achou',
    publishedAt: '2023-04-17T12:00:00Z',
    durationSeconds: 3180,
    platforms: [{ label: 'Spotify', href: '#' }],
  },
}

export const Minimal: Story = {
  name: 'Sem resumo nem arte',
  args: { summary: undefined, artworkUrl: undefined, platforms: [] },
}

export const LongTitle: Story = {
  name: 'Título longo',
  args: {
    title:
      'A inteligência artificial já está se tornando consciente e ninguém no Vale do Silício quer ser o primeiro a dizer isso em voz alta',
  },
}

export const List: Story = {
  name: 'Em lista',
  render: () => (
    <Stack gap={4}>
      <EpisodeCard
        number={174}
        title="Nazistas e aliens: o pacto secreto do Terceiro Reich"
        href="#"
        summary="Um oficial da Força Aérea diz ter visto os documentos."
        publishedAt="2026-08-28T12:00:00Z"
        durationSeconds={4340}
        artworkUrl="/brand/logo-bunkerx.jpg"
        platforms={[{ label: 'Spotify', href: '#' }, { label: 'YouTube', href: '#' }]}
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
      <EpisodeCard
        number={172}
        title="Oumuamua não era pedra"
        href="#"
        summary="O objeto interestelar acelerou sem rastro de gás. A gente leu os artigos para você."
        publishedAt="2026-08-14T12:00:00Z"
        durationSeconds={3960}
        artworkUrl="/brand/logo-bunkerx.jpg"
        platforms={[{ label: 'Spotify', href: '#' }, { label: 'Apple', href: '#' }]}
      />
    </Stack>
  ),
}
