import type { Meta, StoryObj } from '@storybook/react-vite'
import { NoSignal } from './NoSignal'
import { Button } from '../../controls/Button/Button'

const meta = {
  title: 'Signal/NoSignal',
  component: NoSignal,
} satisfies Meta<typeof NoSignal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EmptySearch: Story = {
  name: 'Busca sem resultado',
  parameters: {
    docs: {
      description: {
        story:
          'Tela vazia é um convite para agir. A mensagem diz o que fazer em seguida em vez de só lamentar a ausência, e a ação de recuperação vem junto.',
      },
    },
  },
  args: {
    message: 'Nenhum episódio com esse termo. Tente outra palavra ou volte para a lista completa.',
    action: <Button variant="outline">Ver todos os episódios</Button>,
  },
}

export const FeedDown: Story = {
  name: 'Fonte fora do ar',
  args: {
    title: 'SINAL PERDIDO',
    message: 'Não conseguimos falar com o feed do podcast agora. Os episódios voltam sozinhos assim que a conexão restabelecer.',
    action: <Button variant="outline">Tentar de novo</Button>,
  },
}

export const Bars: Story = {
  name: 'As barras',
  parameters: {
    docs: {
      description: {
        story:
          'As barras não são o padrão SMPTE de transmissão — são a paleta da marca. O cartão precisa ler como o Bunker X perdendo sinal, não como televisão genérica.',
      },
    },
  },
  args: { title: 'SEM SINAL', message: 'Nada transmitindo neste canal por enquanto.' },
}
