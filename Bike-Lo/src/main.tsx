import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './mobile.css'
import App from './App.tsx'

import { LoadingProvider } from '@/hooks/use-loading'
import { AuthProvider } from '@/hooks/use-auth'
import { ThemeProvider } from '@/hooks/use-theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
