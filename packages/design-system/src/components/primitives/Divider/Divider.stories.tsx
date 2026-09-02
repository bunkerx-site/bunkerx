import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './Divider'
import { Text } from '../../primitives/Text/Text'

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
  argTypes: { variant: { control: { type: 'inline-radio' }, options: ['dashed', 'solid'] } },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Não é uma régua de 1px: é uma interrupção do sinal. O tracejado some nas duas pontas, como uma fita rasgada atravessando a parede.',
      },
    },
  },
  render: (args) => (
    <div>
      <Text>Bloco anterior.</Text>
      <Divider {...args} />
      <Text>Bloco seguinte.</Text>
    </div>
  ),
}

export const Solid: Story = { ...Default, args: { variant: 'solid' } }
export const Tight: Story = { ...Default, args: { tight: true } }
