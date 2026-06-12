import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from './components/ui/tooltip.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster/>
          <App />
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
);
