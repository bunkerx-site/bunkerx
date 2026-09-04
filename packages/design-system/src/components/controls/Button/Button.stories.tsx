import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'Controls/Button',
  component: Button,
  argTypes: {
    variant: { control: { type: 'inline-radio' }, options: ['phosphor', 'outline', 'ghost'] },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  args: { children: 'Ouvir episódio', variant: 'phosphor' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  name: 'Variantes',
  parameters: {
    docs: {
      description: {
        story:
          '`phosphor` é o controle ligado e deve existir uma vez por tela. Duas ações primárias competindo na mesma tela é sinal de que a hierarquia não foi decidida.',
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <Button variant="phosphor">Ouvir episódio</Button>
      <Button variant="outline">Ver todos</Button>
      <Button variant="quiet">Cancelar</Button>
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Tamanhos',
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <Button size="sm">Pequeno</Button>
      <Button>Médio</Button>
      <Button size="md">Grande</Button>
    </div>
  ),
}

export const Disabled: Story = {
  name: 'Desabilitado',
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <Button disabled>Indisponível</Button>
      <Button variant="outline" disabled>
        Indisponível
      </Button>
    </div>
  ),
}

export const Labelling: Story = {
  name: 'Como nomear',
  parameters: {
    docs: {
      description: {
        story:
          'O rótulo diz exatamente o que acontece, e o nome da ação se mantém pelo fluxo inteiro: o botão "Publicar" produz o aviso "Publicado".',
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
        <Button>Salvar alterações</Button>
        <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
          diz o que acontece
        </p>
      </div>
      <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
        <Button variant="outline">Enviar</Button>
        <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
          não diz — enviar o quê, para onde?
        </p>
      </div>
    </div>
  ),
}
