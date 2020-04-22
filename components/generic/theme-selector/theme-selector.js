import { useState } from 'react'
import Select from '../select/select'

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
  const [selectedTheme, setSelectedTheme] = useState(props.selectedTheme || 'Light')
  const availableThemes = [{
    title: 'Light',
    id: 'Light'
  }, {
    title: 'Dark',
    id: 'Dark'
  }, {
    title: 'Robot',
    id: 'Robot'
  }]

  const onChange = (ev) => {
    console.log(ev.target.value)
  }

  const prefixes = [{
    value: 'Light',
    prefix: <ColorBubble color="white" />
  }, {
    value: 'Dark',
    prefix: <ColorBubble color="black" />
  }, {
    value: 'Robot',
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