# next-dark-mode

[![npm version](https://img.shields.io/npm/v/next-dark-mode?style=for-the-badge)](https://www.npmjs.com/package/next-dark-mode)

Enable Dark Mode for Next.js

It uses cookies to persist the state of the current theme.

Gets you that dark mode without the page load glitch and supports auto mode that switches the user's theme based on the OS.

## Requirement

To use `next-dark-mode`, you must use `react@16.8.0` or greater which includes [Hooks](https://reactjs.org/docs/hooks-intro.html).

## Installation

```sh
$ yarn add next-dark-mode

or

$ npm install next-dark-mode
```

## Usage

```js
// _app.js
import withDarkMode from 'next-dark-mode'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withDarkMode(MyApp)
```
