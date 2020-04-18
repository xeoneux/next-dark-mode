import { DarkModeContext } from 'next-dark-mode'
import React, { Fragment, useContext } from 'react'

export default function () {
  const { mode, toggleAuto, toggleDark, toggleLight } = useContext(DarkModeContext)

  const toggleMode = (text: string) => {
    if (text === 'Auto') toggleAuto()
    if (text === 'Dark') toggleDark()
    if (text === 'Light') toggleLight()
  }

  return (
    <div className={`layout ${mode}`}>
      <div className="switch">
        {['Auto', 'Dark', 'Light'].map((text, index) => (
          <Fragment key={index}>
            <input
              checked={text.toLowerCase() === mode}
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
