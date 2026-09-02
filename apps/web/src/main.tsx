import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// Vite's library mode extracts the design system's CSS into its own file, so
// importing the components alone ships no styles. This has to be explicit.
import '@bunkerx/design-system/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
