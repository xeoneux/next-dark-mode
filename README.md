<div align="center">

# `next-dark-mode`

🌓 Theme your Next.js apps with a Dark Mode

[![license](https://img.shields.io/npm/l/next-dark-mode?style=for-the-badge)](https://github.com/xeoneux/next-dark-mode/blob/master/LICENSE)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/next-dark-mode?style=for-the-badge)](https://bundlephobia.com/result?p=next-dark-mode)
[![npm version](https://img.shields.io/npm/v/next-dark-mode?style=for-the-badge)](https://www.npmjs.com/package/next-dark-mode)

<img src="https://github.com/xeoneux/next-dark-mode/blob/master/assets/next-dark-mode.gif" />

</div>

## Contents:

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Resources](#resources)

## Features

<img align="right" width="50%" src="https://github.com/xeoneux/next-dark-mode/blob/master/assets/feature-auto.gif" />

### Auto mode

`next-dark-mode` supports an **auto mode** which automatically switches the user's theme based on the color mode selected on their operating system.

[Windows](https://blogs.windows.com/windowsexperience/2016/08/08/windows-10-tip-personalize-your-pc-by-enabling-the-dark-theme) and [macOS](https://support.apple.com/en-in/HT208976) both support setting the dark or light mode based on the time of the day.

It is achieved via `prefers-color-scheme` media query.

<img align="right" width="50%" src="https://github.com/xeoneux/next-dark-mode/blob/master/assets/feature-cookies.gif" />

### No page load glitch

`next-dark-mode` uses configurable **cookies** to persist the state of the current theme, one for the _auto mode_ and the other for the _dark mode_.

This prevents the common page load glitch with the local storage approach where the app loads on the client and then the state of the user's theme is fetched.

You can see it in this implementation by [Pantaley Stoyanov](https://pantaley.com).

NOTE: This library is not compatible with [Next.js 9's Auto Partial Static Export](https://nextjs.org/blog/next-9#automatic-partial-static-export) feature as it has to read the cookies in `getInitialProps` function, which makes all pages incompatible with Automatic Partial Static Export feature.

## Requirements

To use `next-dark-mode`, you must use `react@16.8.0` or greater which includes [Hooks](https://reactjs.org/docs/hooks-intro.html).

## Installation

```sh
$ yarn add next-dark-mode

or

$ npm install next-dark-mode
```

## Usage

1. Wrap your [\_app.js](https://nextjs.org/docs/advanced-features/custom-app) component (located in `/pages`) with the [HOC](https://reactjs.org/docs/higher-order-components.html) `withDarkMode`

   ```js
   // _app.js
   import App from 'next/app'
   import withDarkMode from 'next-dark-mode'

   export default withDarkMode(App)
   ```

2) You can now use the `useDarkMode` hook

   ```js
   import { useDarkMode } from 'next-dark-mode'

   const MyComponent = props => {
     const {
       autoModeActive,
       autoModeSupported,
       darkModeActive,
       switchToAutoMode,
       switchToDarkMode,
       switchToLightMode,
     } = useDarkMode()

    ...
   }
   ```

## Configuration

The `withDarkMode` function accepts a `config` object as its second argument. Every key is optional with default values mentioned:

- `autoModeCookieName`: string - Name of the cookie used to determine whether the auto preset is enabled.
  Defaults to `'autoMode'`.
- `cookieOptions`: object - Configuration [options](https://github.com/jshttp/cookie#options-1) for the cookies that gets set on the client.
  Defaults to `{ sameSite: 'lax' }`.
- `darkModeCookieName`: string - Name of the cookie used to determine whether the dark preset is enabled.
  Defaults to `'darkMode'`.
- `defaultMode`: string - Determines the default color mode when there's no cookie set on the client. This usually happens on the first ever page load. It can either be `'dark'` or `'light'` and it defaults to `'light'`.
- `provider`: boolean - By default the main App is wrapped in a `DarkModeContext.Provider` to utilize the `useDarkMode` hook. If you want to use the library with a CSS-in-JS solution like [emotion](https://github.com/emotion-js/emotion) or [styled-components](https://github.com/styled-components/styled-components), you can disable the default provider. Defaults to `true`.

## Resources

- [CSS-Tricks | Dark Mode in CSS](https://css-tricks.com/dark-modes-with-css)
- [`prefers-color-scheme` browser support](https://caniuse.com/#feat=prefers-color-scheme)
- [prefers-color-scheme: Hello darkness, my old friend](https://web.dev/prefers-color-scheme)
- [Browsers Are Bringing Automatic Dark Mode to Websites](https://www.howtogeek.com/440920/browsers-are-bringing-automatic-dark-mode-to-websites)
- [Create a dark mode in React with CSS variables and localStorage](https://pantaley.com/blog/Create-a-dark-mode-in-React-with-CSS-variables-and-localStorage)
