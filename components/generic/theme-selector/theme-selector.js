import { useState, useContext } from 'react'
import Select from '../select/select'

import { EmpiezaThemeContext, MODE } from '../../../lib/contexts/empieza-theme'

function ColorBubble(props) {
  return (
    <>
      <div className="color-bubble"></div>
      <style jsx>{`
        .color-bubble {
          width: var(--empz-gap);
          height: var(--empz-gap);
          border-radius: 100%;
          border: 1px solid ${props.border || 'var(--accents-5)'};
          background: ${props.color || 'white'};
        }
      `}</style>
    </>
  )
}

export default function (props) {
  const { mode, switchMode } = useContext(EmpiezaThemeContext)

  const [selectedTheme, setSelectedTheme] = useState(mode || MODE.LIGHT)
  const availableThemes = [
    {
      title: 'Light',
      id: MODE.LIGHT,
    },
    {
      title: 'Dark',
      id: MODE.DARK,
    },
    {
      title: 'Robot',
      id: MODE.ROBOT,
    },
    {
      title: 'Kawaii',
      id: MODE.KAWAII,
    },
  ]

  const onChange = (ev) => {
    switchMode(ev.target.value)
  }

  const prefixes = [
    {
      value: MODE.LIGHT,
      prefix: <ColorBubble color="white" />,
    },
    {
      value: MODE.DARK,
      prefix: <ColorBubble color="black" border="white" />,
    },
    {
      value: MODE.ROBOT,
      prefix: <ColorBubble color="#33cf33" />,
    },
    {
      value: MODE.KAWAII,
      prefix: <ColorBubble color="pink" />,
    },
  ]

  return (
    <>
      <div className="theme-selector">
        <Select onChange={onChange} prefixes={prefixes} value={selectedTheme}>
          {availableThemes.map((t) => (
            <option key={t.id} selected={selectedTheme === t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </Select>
      </div>
    </>
  )
}
