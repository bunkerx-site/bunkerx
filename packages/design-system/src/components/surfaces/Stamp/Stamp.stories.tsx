import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stamp } from './Stamp'

const meta = {
  title: 'Surfaces/Stamp',
  component: Stamp,
  argTypes: {
    tone: { control: { type: 'inline-radio' }, options: ['classified', 'verified', 'archive'] },
  },
  args: { children: 'classificado', tone: 'open' },
} satisfies Meta<typeof Stamp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  name: 'Tons',
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <Stamp tone="open">classificado</Stamp>
      <Stamp tone="open">inédito</Stamp>
      <Stamp tone="open">arquivo</Stamp>
    </div>
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
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <Stamp tone="open">inédito</Stamp>
      <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
        A rotação vem de ter sido pressionado à mão. Use `` só quando o carimbo aparecer no
        meio de uma linha de texto corrido.
      </p>
      <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
        Este episódio está <Stamp tone="open" >arquivado</Stamp> desde agosto.
      </p>
    </div>
  ),
}
