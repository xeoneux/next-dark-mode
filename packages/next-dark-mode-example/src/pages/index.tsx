import { DarkModeContext } from 'next-dark-mode'
import React, { useContext } from 'react'

export default function () {
  let [theme, methods] = useContext(DarkModeContext)

  return (
    <>
      <h1>Hello World</h1>
      <p>The theme is {theme}</p>
      <p onClick={(methods as any).toggleAuto}>auto</p>
      <p onClick={(methods as any).toggleDark}>dark</p>
      <p onClick={(methods as any).toggleLight}>light</p>
    </>
  )
}
