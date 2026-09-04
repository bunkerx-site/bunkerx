import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from './Panel'

const meta = {
  title: 'Surfaces/Panel',
  component: Panel,
  argTypes: { tone: { control: { type: 'inline-radio' }, options: ['signal', 'flat'] } },
  args: { children: 'Conteúdo do painel' },
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Panel {...args}>
      <h3 style={{ fontFamily: "var(--bx-font-display)", fontSize: "var(--bx-text-xl)", margin: 0 }}>
        Arquivo 174
      </h3>
      <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
        Três registros, dois telescópios e uma explicação que ninguém quis assinar.
      </p>
    </Panel>
  ),
}

export const Marked: Story = {
  name: 'Com marcas de registro',
  parameters: {
    docs: {
      description: {
        story:
          'As marcas de canto são de registro de impressão. Elas dizem que o quadro é um recorte deliberado, não um card com borda — por isso aparecem só em dois cantos opostos.',
      },
    },
  },
  ...Default,
  args: { marked: true },
}

export const Tones: Story = {
  name: 'Tons',
  parameters: {
    docs: {
      description: {
        story:
          '`signal` tem fundo e borda próprios e eleva o conteúdo. `flat` só delimita, sem pintar — use quando o painel estiver dentro de outra superfície e um segundo fundo viraria sujeira.',
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <Panel marked style={{ flex: 1 }}>
        <h3 style={{ fontFamily: "var(--bx-font-display)", fontSize: "var(--bx-text-xl)", margin: 0 }}>
          Elevado
        </h3>
        <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
          Fundo próprio, borda de fósforo. O padrão para bloco de conteúdo.
        </p>
      </Panel>
      <Panel tone="flat" style={{ flex: 1 }}>
        <h3 style={{ fontFamily: "var(--bx-font-display)", fontSize: "var(--bx-text-xl)", margin: 0 }}>
          Plano
        </h3>
        <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
          Só o contorno. Não acrescenta fundo sobre um fundo que já existe.
        </p>
      </Panel>
    </div>
  ),
}

export const Flat: Story = { ...Default, args: { tone: 'flat' } }
