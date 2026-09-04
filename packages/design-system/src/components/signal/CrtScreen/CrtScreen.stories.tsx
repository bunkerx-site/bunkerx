import type { Meta, StoryObj } from '@storybook/react-vite'
import { CrtScreen } from './CrtScreen'

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
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <h3 style={{ fontFamily: "var(--bx-font-display)", fontSize: "var(--bx-text-xl)", margin: 0 }}>
        A vinheta
      </h3>
      <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
        A vinheta escurece as bordas como o vidro curvo de um monitor real. É tudo que sobrou
        desta camada: qualquer coisa mais forte aqui passa por cima de texto.
      </p>
      <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
        Como todas as stories já renderizam dentro de um `CrtScreen` e de um `Background`, o que
        você vê aqui é o efeito real do site, não uma simulação.
      </p>
    </div>
  ),
}
