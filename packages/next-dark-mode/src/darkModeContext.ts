import { createContext } from 'react'

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
