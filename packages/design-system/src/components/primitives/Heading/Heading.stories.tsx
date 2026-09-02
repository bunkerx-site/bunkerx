import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from './Heading'

const meta = {
  title: 'Primitives/Heading',
  component: Heading,
  argTypes: {
    level: { control: { type: 'select' }, options: [1, 2, 3, 4, 5, 6] },
    size: { control: { type: 'select' }, options: [undefined, 1, 2, 3, 4, 5, 6] },
    tone: { control: { type: 'inline-radio' }, options: ['default', 'accent'] },
  },
  args: { children: 'Os OVNIs que cruzaram a Lua', level: 2 },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Scale: Story = {
  name: 'Escala completa',
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          Nível {level} — sua dose semanal de verdade
        </Heading>
      ))}
    </div>
  ),
}

export const LevelVersusSize: Story = {
  name: 'Nível ≠ tamanho',
  parameters: {
    docs: {
      description: {
        story:
          'O nível semântico e o tamanho visual são props separadas. Uma seção pode começar com um h2 pequeno sem quebrar o outline do documento — importa para leitores de tela e para SEO.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Heading level={2} size={5}>
        h2 renderizado no tamanho 5
      </Heading>
      <Heading level={4} size={2}>
        h4 renderizado no tamanho 2
      </Heading>
    </div>
  ),
}

export const Accent: Story = { args: { tone: 'accent', children: 'Transmissão ao vivo' } }

