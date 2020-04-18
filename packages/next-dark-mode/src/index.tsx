import darkmodejs from '@assortment/darkmodejs'
import { NextComponentType } from 'next'
import { AppContext } from 'next/app'
import { parseCookies, setCookie } from 'nookies'
import React, { createContext, useEffect, useState } from 'react'

export enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface Config {
  debug: boolean
  defaultMode: MODE
  cookieName: string
}

const defaultConfig: Config = {
  debug: false,
  defaultMode: MODE.LIGHT,
  cookieName: 'nextDarkMode',
}

const validCookie = (cookie: string): boolean => !!cookie && typeof cookie === 'string'

const getDarkMode = (cookieMode: string): MODE =>
  validCookie(cookieMode) && (cookieMode === MODE.DARK || cookieMode === MODE.LIGHT)
    ? cookieMode
    : defaultConfig.defaultMode

export const DarkModeContext = createContext<DarkModeContextConsumer>({
  mode: defaultConfig.defaultMode,
  toggleAuto: () => {},
  toggleDark: () => {},
  toggleLight: () => {},
})

DarkModeContext.displayName = 'NextDarkMode'

export default (App: NextComponentType | any, config?: Partial<Config>) => {
  const mergedConfig = { ...defaultConfig, ...config }
  const { cookieName, defaultMode } = mergedConfig

  function NextDarkMode({ initialProps, ...props }: WrappedAppProps) {
    // TODO: Figure out if we should set it as null instead?
    const [autoMode, setAutoMode] = useState(defaultMode)
    const [darkModeState, setDarkModeState] = useState({
      mode: defaultMode,
      toggleAuto: () => setDarkModeState({ mode: autoMode, ...darkModeState }),
      toggleDark: () => setDarkModeState({ mode: MODE.DARK, ...darkModeState }),
      toggleLight: () => setDarkModeState({ mode: MODE.LIGHT, ...darkModeState }),
    })

    useEffect(() => {
      const { removeListeners } = darkmodejs({
        onChange: (activeTheme, themes) => {
          const nextDarkMode = getDarkMode(parseCookies()[cookieName])

          switch (activeTheme) {
            case themes.DARK:
              if (nextDarkMode !== MODE.DARK) setCookie(null, cookieName, MODE.DARK, {})
              setAutoMode(MODE.DARK)
              break
            case themes.LIGHT:
              if (nextDarkMode !== MODE.LIGHT) setCookie(null, cookieName, MODE.LIGHT, {})
              break
            case themes.NO_PREF:
            case themes.NO_SUPP:
              if (nextDarkMode !== defaultMode) setCookie(null, cookieName, defaultMode, {})
              break
          }
        },
      })

      return removeListeners
    }, [])

    return (
      <DarkModeContext.Provider value={darkModeState}>
        <App {...props} {...initialProps} />
      </DarkModeContext.Provider>
    )
  }

  NextDarkMode.getInitialProps = async ({ Component, ctx }: AppContext) => {
    const initialProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}

    if (typeof window === 'undefined') {
      const cookieMode = parseCookies(ctx)[cookieName]
      const nextDarkMode = getDarkMode(cookieMode)

      if (cookieMode !== nextDarkMode) setCookie(ctx, cookieName, nextDarkMode, {})

      return { initialProps, nextDarkMode }
    }

    return { initialProps }
  }

  NextDarkMode.displayName = `withDarkMode(${App.displayName || App.name || 'App'})`

  return NextDarkMode
}

export interface DarkModeContextConsumer {
  mode: MODE
  toggleAuto: () => void
  toggleDark: () => void
  toggleLight: () => void
}

export interface WrappedAppProps {
  initialProps: any
  nextDarkMode?: MODE
}
