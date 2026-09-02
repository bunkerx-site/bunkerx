import type { Meta, StoryObj } from '@storybook/react-vite'
import { Static } from './Static'
import { Stack } from '../../primitives/Stack/Stack'
import { Text } from '../../primitives/Text/Text'

const meta = {
  title: 'Signal/Static',
  component: Static,
  argTypes: {
    intensity: { control: { type: 'range', min: 0, max: 1, step: 0.02 } },
    fps: { control: { type: 'range', min: 1, max: 60, step: 1 } },
  },
  args: { intensity: 0.28, fps: 24 },
} satisfies Meta<typeof Static>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '100%', height: 280, background: 'var(--bx-void-deep)' }}>
      <Static {...args} />
    </div>
  ),
}

export const Intensities: Story = {
  name: 'Intensidades',
  parameters: {
    docs: {
      description: {
        story:
          'O ruído é pintado em um quarto da resolução e ampliado pelo navegador: o grão fica mais grosso, mais perto de chuvisco de transmissão real, e custa um quarto do preenchimento.',
      },
    },
  },
  render: () => (
    <Stack direction="row" gap={4}>
      {[0.12, 0.28, 0.55].map((intensity) => (
        <div key={intensity} style={{ flex: 1 }}>
          <Text size="xs" mono tone="mute">
            intensity={intensity}
          </Text>
          <div style={{ height: 180, marginTop: '0.5rem', background: 'var(--bx-void-deep)' }}>
            <Static intensity={intensity} />
          </div>
        </div>
      ))}
    </Stack>
  ),
}

export const ReducedMotion: Story = {
  name: 'Movimento reduzido',
  parameters: {
    docs: {
      description: {
        story:
          'Com `prefers-reduced-motion: reduce`, o componente pinta um único quadro congelado em vez de rodar o loop. A textura continua, a animação não.',
      },
    },
  },
  render: () => (
    <Stack gap={3}>
      <div style={{ height: 200, background: 'var(--bx-void-deep)' }}>
        <Static />
      </div>
      <Text size="sm" tone="mute">
        Ative a preferência no sistema operacional e recarregue para comparar.
      </Text>
    </Stack>
  ),
}
