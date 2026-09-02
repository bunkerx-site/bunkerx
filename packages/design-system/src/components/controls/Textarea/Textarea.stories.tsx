import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta = {
  title: 'Controls/Textarea',
  component: Textarea,
  args: {
    label: 'Conte seu avistamento',
    placeholder: 'Data, hora, o que você viu…',
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  name: 'Com dica',
  args: { hint: 'Quanto mais detalhe, melhor. Nada disso vai ao ar sem o seu aval.' },
}

export const WithError: Story = {
  name: 'Com erro',
  args: {
    defaultValue: 'vi uma luz',
    error: 'Conte pelo menos onde e quando foi — sem isso não conseguimos checar.',
  },
}

export const Filled: Story = {
  name: 'Preenchido',
  args: {
    defaultValue:
      'Dia 12 de agosto, por volta das 22h, na estrada entre Bragança e Atibaia. Três luzes em triângulo, paradas por uns quarenta segundos, depois sumiram sem som nenhum.',
  },
}
