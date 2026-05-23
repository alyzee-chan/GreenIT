import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './i18n'
import './index.css'
import App from './App.jsx'

// Apply persisted theme before first paint to avoid a flash of the wrong theme.
try {
  const stored = JSON.parse(localStorage.getItem('greenit-theme'))?.state?.theme
  document.documentElement.setAttribute('data-theme', stored === 'dark' ? 'dark' : 'light')
} catch {
  document.documentElement.setAttribute('data-theme', 'light')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
