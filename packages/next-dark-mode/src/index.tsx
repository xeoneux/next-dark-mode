import darkmodejs from '@assortment/darkmodejs'
import { parseCookies, setCookie } from 'nookies'
import React, { useEffect } from 'react'
import { AppContextType, AppPropsType } from 'next/dist/next-server/lib/utils'

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

const isSupportedPreset = (mode: string) => [THEMES.DARK, THEMES.LIGHT].includes(mode)
const isSupportedSelect = (mode: string) => [THEMES.AUTO, THEMES.DARK, THEMES.LIGHT].includes(mode)

export default () => {
  function NextDarkModeApp({ Component, pageProps }: AppPropsType) {
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

    return <Component {...pageProps} />
  }

  NextDarkModeApp.getInitialProps = async ({ Component, ctx }: AppContextType) => {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}

    if (typeof window === 'undefined') {
      let cookie = parseCookies(ctx)[config.cookieName]

      let [preset, select, system] =
        cookie && cookie.length === 3 ? cookie.split('') : [THEMES.LIGHT, THEMES.AUTO, THEMES.UNSET]

      if (!isSupportedPreset(preset)) preset = THEMES.LIGHT
      if (!isSupportedSelect(select)) select = THEMES.AUTO
      if (!isSupportedPreset(system)) system = THEMES.UNSET

      cookie = preset + select + system

      setCookie(ctx, config.cookieName, cookie, { sameSite: true })

      return { mode: cookie, pageProps }
    }

    return { pageProps }
  }

  return NextDarkModeApp
}
