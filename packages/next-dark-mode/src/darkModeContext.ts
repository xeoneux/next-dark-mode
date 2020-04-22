import { createContext, useContext } from 'react'

import { defaultConfig, MODE } from './config'

export const DarkModeContext = createContext({
  autoModeActive: true,
  autoModeSupported: true,
  darkModeActive: defaultConfig.defaultMode === MODE.DARK,
  switchToAutoMode: () => {},
  switchToDarkMode: () => {},
  switchToLightMode: () => {},
})

DarkModeContext.displayName = 'DarkMode'

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeContext Provider')
  }
  return context
}
