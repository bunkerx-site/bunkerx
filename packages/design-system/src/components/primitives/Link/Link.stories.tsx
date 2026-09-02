import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from './Link'
import { Text } from '../../primitives/Text/Text'

const meta = {
  title: 'Primitives/Link',
  component: Link,
  argTypes: { tone: { control: { type: 'inline-radio' }, options: ['default', 'quiet'] } },
  args: { children: 'ver todos os episódios', href: '#' },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Quiet: Story = { args: { tone: 'quiet', children: 'política de privacidade' } }

export const External: Story = {
  name: 'Externo',
  parameters: {
    docs: {
      description: {
        story:
          'Links externos abrem em nova aba, carregam `rel="noreferrer noopener"` e ganham um ícone com equivalente falado. Sem seta "→" no texto: o sublinhado já diz que é link.',
      },
    },
  },
  args: { external: true, href: 'https://montink.com/bunker-x/', children: 'loja do Bunker X' },
}

export const InRunningText: Story = {
  name: 'Dentro do texto',
  render: () => (
    <Text>
      O feed original do podcast está no <Link href="#">Anchor</Link>, e as estampas ficam na{' '}
      <Link href="https://montink.com/bunker-x/" external>
        loja
      </Link>
      . Os dois alimentam o mesmo site.
    </Text>
  ),
}
