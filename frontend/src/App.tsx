/**
 * KrishiMitra AI — Application Router Entrypoint
 * ===============================================
 * Purpose: Mount the browser router under the route tree.
 * Responsibilities: Provide react-router context provider.
 * Dependencies: react-router-dom, app/router/index
 */

import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'

export default function App() {
  return <RouterProvider router={router} />
}