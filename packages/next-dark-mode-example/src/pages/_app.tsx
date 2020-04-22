import App from 'next/app'
import withDarkMode, { MODE } from 'next-dark-mode'

import '../styles/global.css'

export default withDarkMode(App, { defaultMode: MODE.DARK })
