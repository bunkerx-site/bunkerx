import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from './Field'

const meta = {
  title: 'Controls/Field',
  component: Field,
  args: { label: 'Seu e-mail', placeholder: 'agente@bunkerx.com.br' },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  name: 'Com dica',
  args: { hint: 'Usamos só para avisar de episódio novo.' },
}

export const WithError: Story = {
  name: 'Com erro',
  parameters: {
    docs: {
      description: {
        story:
          'A mensagem diz o que deu errado e como resolver, na voz da interface. Erro não pede desculpa e nunca é vago sobre o que aconteceu.',
      },
    },
  },
  args: {
    label: 'Código de acesso',
    defaultValue: 'XK-42',
    error: 'Código incompleto. Ele tem duas letras e quatro números — XK-0042.',
  },
}

export const CustomPrompt: Story = {
  name: 'Prompt do terminal',
  parameters: {
    docs: {
      description: {
        story:
          'O prompt marca a linha como terminal sem depender de um placeholder, que some assim que a pessoa começa a digitar.',
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-6)" }}>
      <Field label="Busca" prompt=">" placeholder="oumuamua" />
      <Field label="Coordenada" prompt="#" placeholder="-23.5505, -46.6333" />
    </div>
  ),
}

export const Disabled: Story = {
  name: 'Desabilitado',
  args: { disabled: true, defaultValue: 'agente@bunkerx.com.br' },
}
