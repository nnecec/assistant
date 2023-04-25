import { createContext, useContext } from 'react'
import { useLocalStorage,useMedia } from '@afojs/react-utils'

import type { Dispatch, ReactNode, SetStateAction } from 'react'

export type Theme = 'auto' | 'dark' | 'light'

type ThemeContextType = {
  theme: Omit<Theme, 'auto'>
  setTheme: Dispatch<SetStateAction<Theme | undefined>>
  selectedTheme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [selectedTheme = 'auto', setTheme] = useLocalStorage<Theme>('auto')
  const prefersDarkMode = useMedia('(prefers-color-scheme: dark)', false)

  const theme = selectedTheme === 'auto' ? (prefersDarkMode ? 'dark' : 'light') : selectedTheme

  return (
    <ThemeContext.Provider value={{ selectedTheme, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { ThemeProvider, useTheme }