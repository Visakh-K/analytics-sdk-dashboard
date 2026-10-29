import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeAnalytics } from './utils/analytics-sdk.js'

initializeAnalytics({
  endpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/v1/events',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
