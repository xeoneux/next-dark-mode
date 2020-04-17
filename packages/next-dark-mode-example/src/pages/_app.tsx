import React from 'react'
import App from 'next/app'
import withDarkMode from 'next-dark-mode'

class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props

    return <Component {...pageProps} />
  }
}

export default withDarkMode(MyApp)
