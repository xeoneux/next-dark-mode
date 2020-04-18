import { AppProps } from 'next/app'
import withDarkMode from 'next-dark-mode'

import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default withDarkMode(MyApp)
