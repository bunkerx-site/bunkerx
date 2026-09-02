import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from './Panel'
import { Heading } from '../../primitives/Heading/Heading'
import { Text } from '../../primitives/Text/Text'
import { Stack } from '../../primitives/Stack/Stack'

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
      <Heading level={3} size={5}>
        Arquivo 174
      </Heading>
      <Text size="sm" tone="mute" style={{ marginTop: '0.5rem' }}>
        Três registros, dois telescópios e uma explicação que ninguém quis assinar.
      </Text>
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
    <Stack direction="row" gap={4} align="stretch">
      <Panel marked style={{ flex: 1 }}>
        <Heading level={3} size={5}>
          Elevado
        </Heading>
        <Text size="sm" tone="mute" style={{ marginTop: '0.5rem' }}>
          Fundo próprio, borda de fósforo. O padrão para bloco de conteúdo.
        </Text>
      </Panel>
      <Panel tone="flat" style={{ flex: 1 }}>
        <Heading level={3} size={5}>
          Plano
        </Heading>
        <Text size="sm" tone="mute" style={{ marginTop: '0.5rem' }}>
          Só o contorno. Não acrescenta fundo sobre um fundo que já existe.
        </Text>
      </Panel>
    </Stack>
  ),
}

export const Flat: Story = { ...Default, args: { tone: 'flat' } }
