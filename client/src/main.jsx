import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { Toaster } from 'react-hot-toast'
import axios from 'axios';

// Set global base URL for axios
// For same-origin requests (same domain), use empty string
// For cross-origin, set VITE_SERVER_URL in .env files
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            },
          }} 
        />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
