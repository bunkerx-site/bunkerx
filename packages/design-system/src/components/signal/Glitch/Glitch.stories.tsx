import type { Meta, StoryObj } from '@storybook/react-vite'
import { Glitch } from './Glitch'

const meta = {
  title: 'Signal/Glitch',
  component: Glitch,
  argTypes: { offset: { control: { type: 'inline-radio' }, options: ['none', 'nudge', 'break'] } },
  args: { children: 'fora de sintonia', offset: 'nudge' },
} satisfies Meta<typeof Glitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <Glitch {...args} style={{ fontSize: 'var(--bx-text-3xl)' }} />,
}

export const Offsets: Story = {
  name: 'Graus de deriva',
  parameters: {
    docs: {
      description: {
        story:
          'No lugar de uma cor de destaque, o sistema usa o defeito real de um CRT: os três canhões perdem alinhamento e sobra franja verde de um lado, magenta do outro. Gaste isso em um elemento por tela — aplicado em tudo, deixa de ler como defeito e vira decoração.',
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-6)" }}>
      {(['none', 'nudge', 'break'] as const).map((offset) => (
        <div key={offset}>
          <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
            offset={offset}
          </p>
          <Glitch offset={offset} as="div" style={{ fontSize: 'var(--bx-text-3xl)' }}>
            sua dose semanal de verdade
          </Glitch>
        </div>
      ))}
    </div>
  ),
}

export const Reactive: Story = {
  name: 'Reativo',
  parameters: {
    docs: {
      description: {
        story:
          'Com `reactive`, o alinhamento escorrega quando a pessoa toca o elemento. Movimento que responde a uma ação é bem-vindo; movimento decorativo em toda seção é o que denuncia página gerada.',
      },
    },
  },
  render: () => (
    <Glitch reactive as="div" style={{ fontSize: 'var(--bx-text-3xl)', cursor: 'default' }}>
      passe o mouse aqui
    </Glitch>
  ),
}

export const Accessibility: Story = {
  name: 'Acessibilidade',
  parameters: {
    docs: {
      description: {
        story:
          'As duas cópias fantasma são `aria-hidden`, então o leitor de tela anuncia o texto uma vez só. Sob `prefers-reduced-motion`, a transição some e o deslocamento fica estático.',
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-4)" }}>
      <Glitch offset="break" as="h2" style={{ fontSize: 'var(--bx-text-4xl)' }}>
        Bunker X
      </Glitch>
      <p style={{ margin: 0, color: "var(--bx-signal-mute)", fontSize: "var(--bx-text-sm)" }}>
        Inspecione o elemento: existem três cópias do texto, e só a de cima é anunciada.
      </p>
    </div>
  ),
}
