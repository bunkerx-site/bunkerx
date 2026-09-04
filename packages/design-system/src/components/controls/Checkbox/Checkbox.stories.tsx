import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Controls/Checkbox',
  component: Checkbox,
  args: { label: 'Quero receber aviso de episódio novo' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = { name: 'Marcado', args: { defaultChecked: true } }

export const Disabled: Story = { name: 'Desabilitado', args: { disabled: true } }

export const AsLamp: Story = {
  name: 'Lâmpada, não tique',
  parameters: {
    docs: {
      description: {
        story:
          'O indicador é uma lâmpada acesa ou apagada, não um tique. Em um painel de bunker, o que existe é luz ligada e luz desligada.',
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "var(--bx-space-3)" }}>
      <Checkbox label="Aviso de episódio novo" defaultChecked />
      <Checkbox label="Aviso de produto novo na loja" />
      <Checkbox label="Aceito ser abduzido em horário comercial" defaultChecked />
      <Checkbox label="Opção indisponível neste canal" disabled />
    </div>
  ),
}
