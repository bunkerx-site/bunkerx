import type { Meta, StoryObj } from '@storybook/react-vite'
import { Background } from './Background'
import { Heading } from '../../primitives/Heading/Heading'
import { Stack } from '../../primitives/Stack/Stack'
import { Text } from '../../primitives/Text/Text'

const meta = {
  title: 'Signal/Background',
  component: Background,
  argTypes: {
    tears: { control: { type: 'range', min: 0, max: 12, step: 1 } },
    particles: { control: { type: 'range', min: 0, max: 800, step: 20 } },
    seed: { control: { type: 'number' } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'O que está acontecendo na tela, em oposição ao que a tela é feita. O `CrtScreen` cuida do vidro — varredura e vinheta. Este cuida da imagem: a nebulosa, a poeira em suspensão e o hold vertical escorregando.\n\nTudo fica **atrás** do conteúdo. Interferência que cruza o texto lê como efeito aplicado à página; interferência atrás dele lê como a tela em que a página está.\n\nO preview do Storybook já monta um `Background` global, então o que estas stories mostram é uma segunda instância sobreposta — bom para comparar parâmetros, não para julgar densidade absoluta.',
      },
    },
  },
} satisfies Meta<typeof Background>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <Background {...args} />
      <Stack gap={4}>
        <Heading level={2} size={3}>
          A imagem, não o tubo
        </Heading>
        <Text tone="mute">
          Três camadas: a nebulosa como chão, a poeira em duas profundidades e as faixas de
          dessintonia. Mexa nos controles para ver cada uma isolada.
        </Text>
      </Stack>
    </>
  ),
}

export const TearsOnly: Story = {
  name: 'Só as faixas',
  parameters: {
    docs: {
      description: {
        story:
          'Duas ou três ao mesmo tempo bastam. Cada faixa roda dois ciclos independentes: a varredura, que a leva de cima a baixo, e o flick, que corta o brilho. Eles não se relacionam de propósito — um tubo velho não perde hold vertical e mantém a imagem estável ao mesmo tempo.',
      },
    },
  },
  args: { particles: 0, nebula: false, raster: false, tears: 3 },
  render: (args) => <Background {...args} />,
}

export const ParticlesOnly: Story = {
  name: 'Só as partículas',
  parameters: {
    docs: {
      description: {
        story:
          'Duas populações lendo como duas distâncias: pontos distantes que quase não se movem e poeira próxima que deriva visivelmente. A profundidade vem da diferença entre elas, não do tamanho isolado. Quando saem pela borda, dão a volta em vez de renascer — assim o campo não afina de um lado.',
      },
    },
  },
  args: { tears: 0, nebula: false, raster: false, particles: 320 },
  render: (args) => <Background {...args} />,
}

export const RasterOnly: Story = {
  name: 'Só a raster',
  parameters: {
    docs: {
      description: {
        story:
          'As listras claras ficam atrás do conteúdo, onde podem ser fortes sem custar contraste no texto. A varredura escura que o `CrtScreen` põe por cima é a discreta — inverter isso deixaria o texto sujo.',
      },
    },
  },
  args: { tears: 0, particles: 0, nebula: false, raster: true },
  render: (args) => <Background {...args} />,
}

export const Calm: Story = {
  name: 'Calmo',
  parameters: {
    docs: {
      description: {
        story:
          'Sem faixas: sobram nebulosa, raster e poeira. Use em tela de leitura longa — página de episódio, transcrição — onde o corte constante cansa. Sob `prefers-reduced-motion: reduce` tudo isso para sozinho; `calm` é a decisão editorial, a media query é a garantia.',
      },
    },
  },
  args: { calm: true },
  render: (args) => (
    <>
      <Background {...args} />
      <Stack gap={4}>
        <Heading level={2} size={3}>
          Sem interrupção
        </Heading>
        <Text tone="mute">
          A textura continua, o corte não. É a versão para quando o conteúdo é o que importa.
        </Text>
      </Stack>
    </>
  ),
}

export const Seeds: Story = {
  name: 'Semente',
  parameters: {
    docs: {
      description: {
        story:
          'Toda a aleatoriedade vem de uma semente. A mesma semente sempre produz a mesma tela, então um arranjo que você gostou pode ser fixado — e um snapshot visual não fica piscando entre execuções.',
      },
    },
  },
  args: { seed: 174 },
  render: (args) => (
    <>
      <Background {...args} />
      <Text size="sm" mono tone="accent">
        seed={args.seed}
      </Text>
    </>
  ),
}
