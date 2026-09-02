import type { Preview } from '@storybook/react-vite'
import { Background } from '../src/components/signal/Background/Background'
import { CrtScreen } from '../src/components/signal/CrtScreen/CrtScreen'
import '../src/styles/fonts.css'
import '../src/styles/tokens.css'
import '../src/styles/base.css'

/**
 * Every story renders inside the tube, because no component in this system is
 * ever seen outside it. Reviewing a button on a white canvas would be
 * reviewing something the audience never gets to look at.
 */
const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      // The showroom is the front door of the design system.
      storySort: { order: ['Showroom', 'Primitives', 'Controls', 'Surfaces', 'Signal'] },
    },
  },
  decorators: [
    (Story) => (
      <CrtScreen>
        <Background />
        <div style={{ padding: '2rem', minHeight: '100vh' }}>
          <Story />
        </div>
      </CrtScreen>
    ),
  ],
}

export default preview
