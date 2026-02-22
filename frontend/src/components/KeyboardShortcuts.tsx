import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function KeyboardShortcuts() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const isCtrlOrCmd = event.ctrlKey || event.metaKey

      if (!isCtrlOrCmd) return

      // Ctrl/Cmd + Alt + ... for navegação
      if (event.altKey) {
        if (key === 'd') {
          event.preventDefault()
          navigate('/dashboard')
          return
        }
        if (key === 'l') {
          event.preventDefault()
          navigate('/notes')
          return
        }
        if (key === 'n') {
          event.preventDefault()
          navigate('/notes/new')
          return
        }
      }

      // Ctrl/Cmd + Shift + F foca busca na listagem de notas
      if (event.shiftKey && key === 'f' && location.pathname.startsWith('/notes')) {
        event.preventDefault()
        const searchInput = document.querySelector<HTMLInputElement>('input[data-shortcut="search"]')
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, location.pathname])

  return null
}
