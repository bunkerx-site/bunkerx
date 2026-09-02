import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './Text'

const SAMPLE =
  'Vista seu capacete de alumínio e venha desvendar com os agentes do paranormal as investigações do Bunker X. OVNIs, aparições ectoplásmicas e criaturas sobrenaturais, toda segunda às 20h.'

const meta = {
  title: 'Primitives/Text',
  component: Text,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['xs', 'sm', 'md', 'lg'] },
    tone: { control: { type: 'inline-radio' }, options: ['default', 'mute', 'accent'] },
  },
  args: { children: SAMPLE },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  name: 'Tamanhos',
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {(['lg', 'md', 'sm', 'xs'] as const).map((size) => (
        <Text key={size} size={size}>
          {size} — {SAMPLE}
        </Text>
      ))}
    </div>
  ),
}

export const Measure: Story = {
  name: 'Medida de linha',
  parameters: {
    docs: {
      description: {
        story:
          'O texto trava em 68ch por padrão, mesmo em containers largos. Linha longa demais faz o olho perder o retorno. Use `full` só quando a coluna já for estreita.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <Text>{SAMPLE}</Text>
      <Text full>{SAMPLE}</Text>
    </div>
  ),
}

export const Mono: Story = {
  name: 'Voz de máquina',
  parameters: {
    docs: {
      description: {
        story:
          'A monoespaçada é reservada para valores emitidos por máquina: data, duração, contador, identificador. Não use como estilo de rótulo.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <Text size="xs" mono tone="accent">
        nº 174
      </Text>
      <Text size="xs" mono tone="mute">
        28 ago 2026 · 1h12min
      </Text>
    </div>
  ),
}
