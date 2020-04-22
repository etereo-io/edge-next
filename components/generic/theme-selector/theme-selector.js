import { useState, useContext } from 'react'
import Select from '../select/select'

import { EmpiezaThemeContext, MODE } from '../../../lib/contexts/empieza-theme'


function ColorBubble(props) {
  return <>
    <div className="color-bubble"></div>
    <style jsx>{
      `
      .color-bubble {
        width: 15px;
        height: 15px;
        border-radius: 100%;
        border: 1px solid black;
        background: ${props.color || 'white'};
      }

      `
    }</style>
  </>
}

export default function(props) {
  const { mode, switchMode } = useContext(
    EmpiezaThemeContext
  )
  
  const [selectedTheme, setSelectedTheme] = useState(mode || MODE.LIGHT)
  const availableThemes = [{
    title: 'Light',
    id: MODE.LIGHT
  }, {
    title: 'Dark',
    id: MODE.DARK
  }, {
    title: 'Robot',
    id: MODE.ROBOT
  }]

  const onChange = (ev) => {
    console.log(ev.target.value)
    switchMode(ev.target.value)
  }

  const prefixes = [{
    value: MODE.LIGHT,
    prefix: <ColorBubble color="white" />
  }, {
    value: MODE.DARK,
    prefix: <ColorBubble color="black" />
  }, {
    value: MODE.ROBOT,
    prefix: <ColorBubble color="green" />
  }]

  return (
    <>
      <div className="theme-selector">
        <Select onChange={onChange} prefixes={prefixes} value={selectedTheme}>
          {availableThemes.map(t => <option key={t.id } selected={selectedTheme === t.id} value={t.id}>{t.title}</option>)}
        </Select>
      </div>
      <style jsx>{
        `
        
        `
      }</style>
    </>
  )

}