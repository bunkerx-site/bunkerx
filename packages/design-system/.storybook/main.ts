import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Brand assets live with the web app; Storybook serves the same folder so
  // Avatar and EpisodeCard resolve the identical paths in both places.
  staticDirs: ['../../../apps/web/public'],
}

export default config
