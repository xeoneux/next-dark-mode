import darkmodejs from '@assortment/darkmodejs'
import { NextComponentType } from 'next'
import { AppContext } from 'next/app'
import { parseCookies, setCookie } from 'nookies'
import React, { createContext, useEffect } from 'react'

const THEMES = {
  AUTO: 'A',
  DARK: 'D',
  LIGHT: 'L',
  UNSET: 'X',
}

const config = {
  cookieName: 'nextDarkMode',
  debug: false,
}

const DarkModeContext = createContext(false)

const isSupportedPreset = (mode: string) => [THEMES.DARK, THEMES.LIGHT].includes(mode)
const isSupportedSelect = (mode: string) => [THEMES.AUTO, THEMES.DARK, THEMES.LIGHT].includes(mode)

export default (App: NextComponentType | any) => {
  function NextDarkMode({ initialProps, ...props }: WrappedAppProps) {
    useEffect(() => {
      const { removeListeners } = darkmodejs({
        onChange: (activeTheme, themes) => {
          let cookie = parseCookies()[config.cookieName]
          const [preset, select, system] = cookie.split('')
          switch (activeTheme) {
            case themes.DARK:
              if (system !== THEMES.DARK)
                setCookie(null, config.cookieName, preset + select + THEMES.DARK, {})
              break
            case themes.LIGHT:
              if (system !== THEMES.LIGHT)
                setCookie(null, config.cookieName, preset + select + THEMES.LIGHT, {})
              break
            case themes.NO_PREF:
            case themes.NO_SUPP:
          }
        },
      })

      return removeListeners
    }, [])

    return (
      <DarkModeContext.Provider value={false}>
        <App {...props} {...initialProps} />
      </DarkModeContext.Provider>
    )
  }

  NextDarkMode.getInitialProps = async ({ Component, ctx }: AppContext) => {
    const initialProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}

    if (typeof window === 'undefined') {
      let cookie = parseCookies(ctx)[config.cookieName]

      let [preset, select, system] =
        cookie && cookie.length === 3 ? cookie.split('') : [THEMES.LIGHT, THEMES.AUTO, THEMES.UNSET]

      if (!isSupportedPreset(preset)) preset = THEMES.LIGHT
      if (!isSupportedSelect(select)) select = THEMES.AUTO
      if (!isSupportedPreset(system)) system = THEMES.UNSET

      const newCookie = preset + select + system

      if (cookie !== newCookie) setCookie(ctx, config.cookieName, newCookie, {})

      const mode = select === 'auto' ? system || 'light' : select

      return { nextDarkMode: mode === 'dark', initialProps }
    }

    return { initialProps }
  }

  NextDarkMode.displayName = `withDarkMode(${App.displayName || App.name || 'App'})`

  return NextDarkMode
}

export interface WrappedAppProps {
  initialProps: any
  nextDarkMode: boolean
}
