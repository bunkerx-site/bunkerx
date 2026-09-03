import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
 * The design system's stylesheet is imported before the app.
 *
 * Order matters: App pulls in site.css, and whichever is evaluated first ends
 * up earlier in the bundle. With the app first, every site rule that merely
 * tied on specificity with a design-system rule lost to it — which is how a
 * link hover from the base sheet ended up repainting button labels the site
 * had already coloured. The system is the base; the site refines it.
 *
 * Vite's library mode extracts the design system's CSS into its own file, so
 * importing the components alone ships no styles. This has to be explicit.
 */
import '@bunkerx/design-system/styles.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
