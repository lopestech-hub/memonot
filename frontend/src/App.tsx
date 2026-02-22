import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotesPage } from './pages/NotesPage'
import { NotesListPage } from './pages/NotesListPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'
import { ThemeProvider } from './components/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors">
        <KeyboardShortcuts />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/notes" element={
            <ProtectedRoute>
              <NotesListPage />
            </ProtectedRoute>
          } />
          
          <Route path="/notes/:id" element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
