
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
