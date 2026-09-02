import type { Meta, StoryObj } from '@storybook/react-vite'
import { CrtScreen } from './CrtScreen'
import { Heading } from '../../primitives/Heading/Heading'
import { Stack } from '../../primitives/Stack/Stack'
import { Text } from '../../primitives/Text/Text'

const meta = {
  title: 'Signal/CrtScreen',
  component: CrtScreen,
  parameters: {
    docs: {
      description: {
        component:
          'O vidro do tubo: a vinheta que escurece as bordas. Aplique **uma vez**, na raiz — não aninhe.\n\nHavia aqui uma camada de varredura escura. Ela cobria cada pixel do site, texto incluído, e nas placas de fósforo — onde texto escuro pequeno fica sobre verde claro — riscava direto os glifos. Nenhuma opacidade deixava a linha visível e o texto limpo ao mesmo tempo, então a linha saiu. A raster que resta vive no `Background`, atrás do conteúdo, onde pode ser forte sem tocar em nenhuma letra.\n\nA camada é `pointer-events: none` e fica fora da árvore de acessibilidade, então nada aqui interfere em clique, foco ou leitor de tela.',
      },
    },
  },
  args: { children: null },
} satisfies Meta<typeof CrtScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Glass: Story = {
  name: 'O vidro',
  render: () => (
    <Stack gap={4}>
      <Heading level={2} size={3}>
        A vinheta
      </Heading>
      <Text tone="mute">
        A vinheta escurece as bordas como o vidro curvo de um monitor real. É tudo que sobrou
        desta camada: qualquer coisa mais forte aqui passa por cima de texto.
      </Text>
      <Text tone="mute">
        Como todas as stories já renderizam dentro de um `CrtScreen` e de um `Background`, o que
        você vê aqui é o efeito real do site, não uma simulação.
      </Text>
    </Stack>
  ),
}
