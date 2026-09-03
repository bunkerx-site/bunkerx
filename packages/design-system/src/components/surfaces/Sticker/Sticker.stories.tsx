import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sticker, type StickerName } from './Sticker'

const ALL: StickerName[] = [
  'ufo-beam', 'radar', 'camera', 'filmstrip', 'case-folder', 'note-closed',
  'grey-portrait', 'all-seeing-eye', 'radio-dishes', 'specimen', 'earth',
  'moon-full', 'moon-gibbous', 'moon-half', 'moon-crescent', 'moon-sliver',
  'tape-not-alone', 'tape-look-up', 'stroke-green', 'stroke-purple',
]

const meta = {
  title: 'Surfaces/Sticker',
  component: Sticker,
  argTypes: {
    name: { control: { type: 'select' }, options: ALL },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    rotate: { control: { type: 'range', min: -30, max: 30, step: 1 } },
  },
  args: { name: 'radar', width: '220px', opacity: 1, rotate: 0 },
  parameters: {
    docs: {
      description: {
        component:
          'Cada adesivo é um SVG cujo `viewBox` é a caixa do recorte na folha, com a arte original dentro. É isso que o deixa fluido: a proporção mora no viewBox, então ele escala com a largura que receber e nunca precisa de altura fixa em pixels.\n\nA versão anterior usava `background-position` e só podia ser dimensionada em pixels — por isso precisava ser escondida abaixo de um breakpoint em vez de encolher. Agora nada é escondido.\n\nA folha é a arte original, sem reencodar nem redimensionar. O navegador baixa e decodifica uma vez e reaproveita em todos.\n\nTodos são decorativos: carregam `aria-hidden`, ficam atrás do conteúdo e nunca cobrem texto. Os que têm palavras impressas são acentos — o que o leitor precisa ler é marcação de verdade.',
      },
    },
  },
} satisfies Meta<typeof Sticker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sheet: Story = {
  name: 'A folha',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))',
        gap: '1.5rem',
        alignItems: 'end',
      }}
    >
      {ALL.map((name) => (
        <div key={name}>
          <Sticker name={name} width="100%" />
          <div
            style={{
              marginTop: '0.5rem',
              fontFamily: 'var(--bx-font-mono)',
              fontSize: 'var(--bx-text-xs)',
              color: 'var(--bx-signal-mute)',
            }}
          >
            {name}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const BehindText: Story = {
  name: 'Atrás do texto',
  parameters: {
    docs: {
      description: {
        story:
          'A postura padrão: baixa opacidade, atrás do conteúdo, deslocado para fora da coluna de leitura. Um adesivo que compete com o texto deixou de ser decoração e virou obstáculo.',
      },
    },
  },
  render: () => (
    <div style={{ position: 'relative', padding: '3rem 0', maxWidth: '40rem' }}>
      <Sticker
        name="radar"
        width="clamp(9rem, 24vw, 16rem)"
        opacity={0.18}
        rotate={-6}
        style={{ position: 'absolute', right: '-3rem', top: 0 }}
      />
      <p style={{ position: 'relative', fontSize: 'var(--bx-text-lg)', lineHeight: 1.6 }}>
        O texto continua sendo o que importa. O adesivo fica atrás, deslocado para a margem, com
        opacidade baixa o bastante para dar profundidade sem disputar a leitura.
      </p>
    </div>
  ),
}
