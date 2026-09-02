import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from './Stack'
import { Panel } from '../../surfaces/Panel/Panel'
import { Text } from '../../primitives/Text/Text'

const meta = {
  title: 'Primitives/Stack',
  component: Stack,
  argTypes: {
    direction: { control: { type: 'inline-radio' }, options: ['column', 'row'] },
    gap: { control: { type: 'select' }, options: [1, 2, 3, 4, 6, 8, 12, 16] },
    align: { control: { type: 'inline-radio' }, options: [undefined, 'start', 'center', 'end', 'stretch'] },
  },
  args: { children: null },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

const Box = ({ label }: { label: string }) => (
  <Panel tone="flat" style={{ padding: '0.75rem 1rem' }}>
    <Text size="sm" full>
      {label}
    </Text>
  </Panel>
)

export const Column: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Um eixo, um gap. Mantém decisão de espaçamento fora dos componentes de conteúdo, então margem nunca colapsa de forma imprevisível entre eles.',
      },
    },
  },
  args: { gap: 4 },
  render: (args) => (
    <Stack {...args}>
      <Box label="primeiro" />
      <Box label="segundo" />
      <Box label="terceiro" />
    </Stack>
  ),
}

export const Row: Story = { ...Column, args: { direction: 'row', gap: 4, align: 'center' } }

export const GapScale: Story = {
  name: 'Escala de gap',
  render: () => (
    <Stack gap={8}>
      {([2, 4, 8, 16] as const).map((gap) => (
        <div key={gap}>
          <Text size="xs" mono tone="mute">
            gap {gap}
          </Text>
          <Stack direction="row" gap={gap} style={{ marginTop: '0.5rem' }}>
            <Box label="a" />
            <Box label="b" />
            <Box label="c" />
          </Stack>
        </div>
      ))}
    </Stack>
  ),
}
