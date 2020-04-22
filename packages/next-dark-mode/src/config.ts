export enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface Config {
  autoModeCookieName: string
  darkModeCookieName: string
  defaultMode: MODE
  provider: boolean
}

export const defaultConfig: Config = {
  autoModeCookieName: 'autoMode',
  darkModeCookieName: 'darkMode',
  defaultMode: MODE.LIGHT,
  provider: true,
}
