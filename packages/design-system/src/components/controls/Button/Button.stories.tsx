import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Stack } from '../../primitives/Stack/Stack'
import { Text } from '../../primitives/Text/Text'

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
    <Stack direction="row" gap={4} align="center">
      <Button variant="phosphor">Ouvir episódio</Button>
      <Button variant="outline">Ver todos</Button>
      <Button variant="ghost">Cancelar</Button>
    </Stack>
  ),
}

export const Sizes: Story = {
  name: 'Tamanhos',
  render: () => (
    <Stack direction="row" gap={4} align="center">
      <Button size="sm">Pequeno</Button>
      <Button>Médio</Button>
      <Button size="lg">Grande</Button>
    </Stack>
  ),
}

export const Disabled: Story = {
  name: 'Desabilitado',
  render: () => (
    <Stack direction="row" gap={4} align="center">
      <Button disabled>Indisponível</Button>
      <Button variant="outline" disabled>
        Indisponível
      </Button>
    </Stack>
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
    <Stack gap={4}>
      <Stack direction="row" gap={4} align="center">
        <Button>Salvar alterações</Button>
        <Text size="sm" tone="mute">
          diz o que acontece
        </Text>
      </Stack>
      <Stack direction="row" gap={4} align="center">
        <Button variant="outline">Enviar</Button>
        <Text size="sm" tone="mute">
          não diz — enviar o quê, para onde?
        </Text>
      </Stack>
    </Stack>
  ),
}
