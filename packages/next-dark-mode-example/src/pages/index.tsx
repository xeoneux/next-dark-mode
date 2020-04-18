import { DarkModeContext } from 'next-dark-mode'
import React, { Fragment, useContext } from 'react'

export default function () {
  let [theme, methods] = useContext(DarkModeContext)

  const toggleMode = (mode: string) => {
    ;(methods as any)['toggle' + mode]()
  }

  return (
    <div className={`layout ${theme}`}>
      <div className="switch">
        {['Auto', 'Dark', 'Light'].map((mode, index) => (
          <Fragment key={index}>
            <input
              checked={mode.toLowerCase() === theme}
              id={`_${index}`}
              name="switch"
              onChange={() => toggleMode(mode)}
              type="radio"
            />
            <label className="switch__label" htmlFor={`_${index}`}>
              {mode}
            </label>
          </Fragment>
        ))}
        <div className="switch__indicator" />
      </div>
    </div>
  )
}
