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
  autoModeCookie: string
  darkModeCookie: string
  debug: boolean
  defaultMode: MODE
}

const defaultConfig: Config = {
  darkModeCookie: 'darkMode',
  autoModeCookie: 'autoMode',
  debug: false,
  defaultMode: MODE.LIGHT,
}

const validCookie = (cookie: string): boolean => !!cookie && typeof cookie === 'string'

const getDarkMode = (cookieMode: string): MODE =>
  validCookie(cookieMode) && (cookieMode === MODE.DARK || cookieMode === MODE.LIGHT)
    ? cookieMode
    : defaultConfig.defaultMode

export const DarkModeContext = createContext<DarkModeContextConsumer>({
  autoMode: false,
  darkMode: defaultConfig.defaultMode === MODE.DARK,
  toggleAuto: () => {},
  toggleDark: () => {},
  toggleLight: () => {},
})

DarkModeContext.displayName = 'NextDarkMode'

export default (App: NextComponentType | any, config?: Partial<Config>) => {
  const mergedConfig = { ...defaultConfig, ...config }
  const { darkModeCookie, defaultMode } = mergedConfig

  function NextDarkMode({ initialProps, ...props }: WrappedAppProps) {
    const [autoModeState, setAutoModeState] = useState({ enabled: false, supported: false })
    const [darkModeState, setDarkModeState] = useState({
      autoMode: autoModeState.enabled,
      darkMode: defaultMode === MODE.DARK,
      toggleAuto: () => {
        if (autoModeState.supported) {
          setAutoModeState({ ...autoModeState, enabled: true })
          setDarkModeState({ ...darkModeState, autoMode: true })
        } else {
          setAutoModeState({ ...autoModeState, enabled: false })
          setDarkModeState({ ...darkModeState, autoMode: false })
        }
      },
      toggleDark: () => {
        setAutoModeState({ ...autoModeState, enabled: false })
        setDarkModeState({ ...darkModeState, darkMode: true })
      },
      toggleLight: () => {
        setAutoModeState({ ...autoModeState, enabled: false })
        setDarkModeState({ ...darkModeState, darkMode: false })
      },
    })

    useEffect(() => {
      const { removeListeners } = darkmodejs({
        onChange: (activeTheme, themes) => {
          const nextDarkMode = getDarkMode(parseCookies()[darkModeCookie])

          switch (activeTheme) {
            case themes.DARK:
              if (nextDarkMode !== MODE.DARK) setCookie(null, darkModeCookie, MODE.DARK, {})
              setAutoModeState({ ...autoModeState, supported: true })
              break
            case themes.LIGHT:
              if (nextDarkMode !== MODE.LIGHT) setCookie(null, darkModeCookie, MODE.LIGHT, {})
              setAutoModeState({ ...autoModeState, supported: true })
              break
            case themes.NO_PREF:
            case themes.NO_SUPP:
              if (nextDarkMode !== defaultMode) setCookie(null, darkModeCookie, defaultMode, {})
              setAutoModeState({ ...autoModeState, enabled: false, supported: false })
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
      const cookieMode = parseCookies(ctx)[darkModeCookie]
      const nextDarkMode = getDarkMode(cookieMode)

      if (cookieMode !== nextDarkMode) setCookie(ctx, darkModeCookie, nextDarkMode, {})

      return { initialProps, nextDarkMode }
    }

    return { initialProps }
  }

  NextDarkMode.displayName = `withDarkMode(${App.displayName || App.name || 'App'})`

  return NextDarkMode
}

export interface DarkModeContextConsumer {
  autoMode: boolean
  darkMode: boolean
  toggleAuto: () => void
  toggleDark: () => void
  toggleLight: () => void
}

export interface WrappedAppProps {
  initialProps: any
  nextDarkMode?: MODE
}
