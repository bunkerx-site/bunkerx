import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const PLATFORMS = [
  { label: 'Spotify', value: 'spotify' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Apple Podcasts', value: 'apple' },
  { label: 'Deezer', value: 'deezer' },
]

const meta = {
  title: 'Controls/Select',
  component: Select,
  args: { label: 'Plataforma preferida', options: PLATFORMS },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  name: 'Com dica',
  args: { hint: 'Define para onde os botões de "ouvir" apontam por padrão.' },
}

export const WithError: Story = {
  name: 'Com erro',
  args: { error: 'Escolha uma plataforma para continuar.' },
}

export const NativeMenu: Story = {
  name: 'Menu nativo',
  parameters: {
    docs: {
      description: {
        story:
          'O menu abre com a paleta do sistema operacional, não com a nossa. As `option` recebem cor explícita porque em algumas plataformas elas herdam o fundo do campo e ficam pretas no preto.',
      },
    },
  },
}
