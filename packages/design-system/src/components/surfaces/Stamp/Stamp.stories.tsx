import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stamp } from './Stamp'
import { Stack } from '../../primitives/Stack/Stack'
import { Text } from '../../primitives/Text/Text'

const meta = {
  title: 'Surfaces/Stamp',
  component: Stamp,
  argTypes: {
    tone: { control: { type: 'inline-radio' }, options: ['classified', 'verified', 'archive'] },
  },
  args: { children: 'classificado', tone: 'classified' },
} satisfies Meta<typeof Stamp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  name: 'Tons',
  render: () => (
    <Stack direction="row" gap={6} align="center">
      <Stamp tone="classified">classificado</Stamp>
      <Stamp tone="verified">inédito</Stamp>
      <Stamp tone="archive">arquivo</Stamp>
    </Stack>
  ),
}

export const OnlyUppercase: Story = {
  name: 'A única caixa alta do sistema',
  parameters: {
    docs: {
      description: {
        story:
          'Carimbo é carimbo, então aqui a caixa alta é literal. Em qualquer outro lugar — rótulo, eyebrow, título de seção — o sistema usa caixa de sentença. Caixa alta espalhada é o tique mais comum de página gerada.',
      },
    },
  },
  render: () => (
    <Stack gap={4}>
      <Stamp tone="verified">inédito</Stamp>
      <Text size="sm" tone="mute">
        A rotação vem de ter sido pressionado à mão. Use `straight` só quando o carimbo aparecer no
        meio de uma linha de texto corrido.
      </Text>
      <Text size="sm">
        Este episódio está <Stamp tone="archive" straight>arquivado</Stamp> desde agosto.
      </Text>
    </Stack>
  ),
}
