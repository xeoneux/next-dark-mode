import { NextDarkModeContext } from 'next-dark-mode'
import React, { Fragment, useContext } from 'react'

export default function () {
  const { isAutoModeEnabled, isDarkModeEnabled, switchToAutoMode, switchToDarkMode, switchToLightMode } = useContext(
    NextDarkModeContext
  )

  const findActive = (text: string): boolean => {
    if (isAutoModeEnabled) return text === 'auto'
    else if (isDarkModeEnabled) return text === 'dark'
    else return text === 'light'
  }

  const toggleMode = (text: string) => {
    if (text === 'Auto') switchToAutoMode()
    if (text === 'Dark') switchToDarkMode()
    if (text === 'Light') switchToLightMode()
  }

  return (
    <div className={`layout ${isDarkModeEnabled ? 'dark' : 'light'}`}>
      <div className="switch">
        {['Auto', 'Dark', 'Light'].map((text, index) => (
          <Fragment key={index}>
            <input
              checked={findActive(text.toLowerCase())}
              id={`_${index}`}
              name="switch"
              onChange={() => toggleMode(text)}
              type="radio"
            />
            <label className="switch__label" htmlFor={`_${index}`}>
              {text}
            </label>
          </Fragment>
        ))}
        <div className="switch__indicator" />
      </div>
    </div>
  )
}
