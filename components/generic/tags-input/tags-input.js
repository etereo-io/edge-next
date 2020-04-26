import { useState } from 'react'
import slugify from 'slugify'

const makeNewTag = val => {
  return {
    label: val,
    slug: slugify(val)
  }
}

function Tag(props) {
  return (
    <>
      <div className="tag">{props.tag.label} <span className="close" onClick={props.onClickRemove}><svg width="100%" height="auto"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path id="close-path" d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/></svg></span></div>
  <style jsx>{`
    .tag {
      padding: 4px 4px 4px 8px;
      border-radius: var(--empz-radius);
      color: var(--empz-foreground);
      background: var(--accents-2);
      margin-right: 8px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .close {
      margin: 5px;
      display: inline-block;
      cursor: pointer;
    }

    svg {
      width: 10px;
      height: 10px;
    }

    #close-path {
      fill: var(--empz-foreground);
    }
  `}</style>
    </>
  )
}

export default function(props) {
  const defaultTags = props.defaultTags || []

  const [tags, setTags] = useState(defaultTags)
  const [inputValue, setInputValue] = useState('')

  const onKeyDown = ev => {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      ev.stopPropagation()
    }
  }

  const onKeyUp = (ev) => {
    if( ev.key === ',' || ev.key === 'Enter') {
      ev.preventDefault()
      ev.stopPropagation()

      if (ev.target.value) {
        const newTags = [
          ...tags,
          makeNewTag(ev.target.value)
        ]
        setTags(newTags)
        
        if(props.onChange) {
          props.onChange(newTags)
        }
      }

      setInputValue('')
    }
  }

  const onChangeInput = ev => {
    setInputValue(ev.target.value)
  }

  const onRemoveTag = (index) => {
    const newTags = [...tags.slice(0,index),
      ...tags.slice(index+1,tags.length)]

    setTags(newTags)
    
    if (props.onChange) {
      props.onChange(newTags)
    }
  }

  return (
    <>
      <div className="tags-input">
        <span className="categories">{
          tags.map((t, i) => <Tag key={t.slug} tag={t} onClickRemove={() => onRemoveTag(i)} />)
        }</span>
        <input type="text" className="input-tags" onChange={onChangeInput} value={inputValue} onKeyDown={onKeyDown} onKeyUp={onKeyUp} placeholder={props.placeholder}></input>
      </div>
  <style jsx>{`

    .tags-input {
      display: flex;
      padding: 5px;
      border: var(--light-border);
      flex-wrap: wrap;
    }

    .categories {
      display: flex;
      flex-wrap: wrap;
    }

    input {
      border: none;
      outline: none;
      padding: 5px;
      width: 100%;
      flex: 1;
    }

  `}</style>
    </>
  )
}