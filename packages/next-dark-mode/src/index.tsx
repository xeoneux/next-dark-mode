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
  autoModeCookieName: string
  darkModeCookieName: string
  defaultMode: MODE
}

const defaultConfig: Config = {
  autoModeCookieName: 'autoMode',
  darkModeCookieName: 'darkMode',
  defaultMode: MODE.LIGHT,
}

export const NextDarkModeContext = createContext<NextDarkModeContextConsumer>({
  autoModeActive: true,
  autoModeSupported: true,
  darkModeActive: defaultConfig.defaultMode === MODE.DARK,
  switchToAutoMode: () => {},
  switchToDarkMode: () => {},
  switchToLightMode: () => {},
})

NextDarkModeContext.displayName = 'NextDarkMode'

export default (App: NextComponentType | any, config?: Partial<Config>) => {
  const mergedConfig = { ...defaultConfig, ...config }
  const { autoModeCookieName, darkModeCookieName, defaultMode } = mergedConfig

  function NextDarkMode({ initialProps, ...props }: WrappedAppProps) {
    const [state, setState] = useState({
      autoModeActive: !!props.autoMode,
      autoModeSupported: true,
      browserMode: defaultMode,
      darkModeActive: !!props.darkMode,
      switchToAutoMode: () => {
        if (state.autoModeSupported) {
          setState(state => ({ ...state, autoModeActive: true, darkModeActive: state.browserMode === MODE.DARK }))
          setCookie(null, autoModeCookieName, '1', {})
        }
      },
      switchToDarkMode: () => {
        setState(state => ({ ...state, autoModeActive: false, darkModeActive: true }))
        setCookie(null, autoModeCookieName, '0', {})
        setCookie(null, darkModeCookieName, '1', {})
      },
      switchToLightMode: () => {
        setState(state => ({ ...state, autoModeActive: false, darkModeActive: false }))
        setCookie(null, autoModeCookieName, '0', {})
        setCookie(null, darkModeCookieName, '0', {})
      },
    })

    useEffect(() => {
      const { removeListeners } = darkmodejs({
        onChange: (activeTheme, themes) => {
          switch (activeTheme) {
            case themes.DARK:
              setState(state => ({ ...state, browserMode: MODE.DARK }))
              if (state.autoModeActive && !state.darkModeActive) {
                setState(state => ({ ...state, darkModeActive: true }))
                setCookie(null, darkModeCookieName, '1', {})
              }
              break
            case themes.LIGHT:
              setState(state => ({ ...state, browserMode: MODE.LIGHT }))
              if (state.autoModeActive && state.darkModeActive) {
                setState(state => ({ ...state, darkModeActive: false }))
                setCookie(null, darkModeCookieName, '0', {})
              }
              break
            case themes.NO_PREF:
            case themes.NO_SUPP:
              setState(state => ({ ...state, autoModeSupported: false }))
              setCookie(null, autoModeCookieName, '0', {})
              break
          }
        },
      })

      return removeListeners
    }, [])

    return (
      <NextDarkModeContext.Provider value={state}>
        <App {...props} {...initialProps} />
      </NextDarkModeContext.Provider>
    )
  }

  NextDarkMode.getInitialProps = async ({ Component, ctx }: AppContext) => {
    const initialProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}

    if (typeof window === 'undefined') {
      const cookies = parseCookies(ctx)

      const autoModeCookie = cookies[autoModeCookieName]
      const darkModeCookie = cookies[darkModeCookieName]

      const autoMode = typeof autoModeCookie === 'undefined' ? true : autoModeCookie === '1'
      const darkMode = typeof darkModeCookie === 'undefined' ? defaultMode === MODE.DARK : darkModeCookie === '1'

      const autoModeString = autoMode ? '1' : '0'
      const darkModeString = darkMode ? '1' : '0'

      if (autoModeString !== autoModeCookie) setCookie(ctx, autoModeCookieName, autoModeString, {})
      if (darkModeString !== darkModeCookie) setCookie(ctx, darkModeCookieName, darkModeString, {})

      return { autoMode, darkMode, initialProps }
    }

    return { initialProps }
  }

  NextDarkMode.displayName = `withDarkMode(${App.displayName || App.name || 'App'})`

  return NextDarkMode
}

export interface NextDarkModeContextConsumer {
  autoModeActive: boolean
  autoModeSupported: boolean
  darkModeActive: boolean
  switchToAutoMode: () => void
  switchToDarkMode: () => void
  switchToLightMode: () => void
}

export interface WrappedAppProps {
  autoMode?: boolean
  darkMode?: boolean
  initialProps: any
}
