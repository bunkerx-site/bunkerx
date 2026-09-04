import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta = {
  title: 'Surfaces/Avatar',
  component: Avatar,
  args: { src: '/hosts/affonso-solano.png', name: 'Affonso Solano', size: 120 },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hosts: Story = {
  name: 'Apresentadores',
  parameters: {
    docs: {
      description: {
        story:
          'Retrato como se estivesse num monitor de vigilância: dessaturado, com varredura, empurrado para o fósforo. A cor volta quando você olha direto — passe o mouse.',
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <Avatar src="/hosts/affonso-solano.png" name="Affonso Solano" size={160} showName />
      <Avatar src="/hosts/afonso-3d.png" name="Afonso 3D" size={160} showName />
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Tamanhos',
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      {[40, 64, 96, 160].map((size) => (
        <Avatar key={size} src="/hosts/afonso-3d.png" name="Afonso 3D" size={size} />
      ))}
    </div>
  ),
}

export const Frozen: Story = {
  name: 'Sem retorno de cor',
  parameters: {
    docs: {
      description: {
        story: 'Com `live={false}` o retrato fica permanentemente no monitor, sem reagir ao mouse.',
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-3)" }}>
      <Avatar src="/hosts/affonso-solano.png" name="Affonso Solano" size={120} live={false} />
      <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
        Use em listas longas, onde o retorno de cor a cada linha vira ruído.
      </p>
    </div>
  ),
}
