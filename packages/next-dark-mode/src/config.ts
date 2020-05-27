import { CookieSerializeOptions } from 'cookie'

export enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface Config {
  autoModeCookieName: string
  cookieOptions: CookieSerializeOptions
  darkModeCookieName: string
  defaultMode: MODE
  provider: boolean
}

export const defaultConfig: Config = {
  autoModeCookieName: 'autoMode',
  cookieOptions: { sameSite: 'lax' },
  darkModeCookieName: 'darkMode',
  defaultMode: MODE.LIGHT,
  provider: true,
}
