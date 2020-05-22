import { useState, useContext } from 'react'
import Select from '../select/select'

import {
  EdgeThemeContext,
  themes,
  defaultTheme,
} from '@lib/client/contexts/edge-theme'

function ColorBubble(props) {
  return (
    <>
      <div className="color-bubble"></div>
      <style jsx>{`
        .color-bubble {
          width: var(--edge-gap);
          height: var(--edge-gap);
          border-radius: 100%;
          border: 1px solid ${props.border || 'var(--accents-5)'};
          background: ${props.color || 'white'};
        }
      `}</style>
    </>
  )
}

export default function (props) {
  const { mode, switchMode } = useContext(EdgeThemeContext)

  const [selectedTheme, setSelectedTheme] = useState(mode || defaultTheme)

  const onChange = (ev) => {
    switchMode(ev.target.value)
  }

  const prefixes = themes.map((theme) => {
    return {
      value: theme.value,
      prefix: (
        <ColorBubble color={theme.mainColor} border={theme.borderColor} />
      ),
    }
  })

  return (
    <>
      <div className="theme-selector">
        <Select onChange={onChange} prefixes={prefixes} value={selectedTheme}>
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>
    </>
  )
}
