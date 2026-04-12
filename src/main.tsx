import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AppRouter } from './routes/AppRouter'
import { AuthProvider } from './providers/AuthProvider'
import './globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--neutral-800)',
          color: 'var(--neutral-0)',
          borderRadius: 'var(--radius-md)',
        },
        success: {
          iconTheme: {
            primary: 'var(--success)',
            secondary: 'var(--neutral-0)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--danger)',
            secondary: 'var(--neutral-0)',
          },
        },
      }}
    />
  </StrictMode>,
)
