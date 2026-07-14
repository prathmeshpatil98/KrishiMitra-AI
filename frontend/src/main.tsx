/**
 * KrishiMitra AI — Frontend Entrypoint
 * =====================================
 * Purpose: Mount the root React application into the DOM.
 * Responsibilities: Bind the root element, import global CSS design tokens, inject Providers.
 * Dependencies: react, react-dom, app/providers, App
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Providers } from './app/providers'
import App from './App'

// Import global design system styles
import './styles/index.css'
import './styles/animations.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    "Failed to mount the React application: 'root' element not found in DOM."
  )
}

createRoot(rootElement).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
)