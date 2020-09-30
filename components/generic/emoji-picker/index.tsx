import { nature, objects, people, places, symbols } from './emojis'
import { useCallback, useState } from 'react'

import Markdown from '@lib/markdown'
import MarkdownRead from '@components/generic/markdown-read/markdown-read'

const md = Markdown({
  inline: true,
  html: false
})

type PropTypes = {
  onSelect: (emoji: string) => void
}

const types = {
  people: 'people',
  nature: 'nature',
  objects: 'objects',
  places: 'places',
  symbols: 'symbols'
}

export default function EmojiPicker({
  onSelect
}: PropTypes) {
  const [selectedType, setSelectedType] = useState(types.people)
  const [open, setOpen] = useState(false)

  const listOfTypes = useCallback(() => {
    if (!open) {
      return []
    }

    switch(selectedType) {
      case types.people:
        return people
      
      case types.nature:
        return nature
      
      case types.symbols:
        return symbols

      case types.objects:
        return objects
      
      case types.places:
        return places
    }
  }, [selectedType, open])

  const selectItem = (i) => {
    setOpen(false)
    onSelect(i)
  }

  return (
    <>
      <div className="emoji-picker">
        <div className={`selection-layer ${open ? 'open' : ''}`}>
          <div className="list">
            {listOfTypes().map(i => {
              const content = md.renderInline(i)

              return <div key={i} className="item" onClick={() => selectItem(i)} title={i}><MarkdownRead htmlString={content} /></div>
            })}
          </div>
          <div className="options">
            <div className={`option ${selectedType === types.people ? 'selected' : ''}`} onClick={() => setSelectedType(types.people)}><MarkdownRead htmlString={md.renderInline(':blush:')} /></div>
            <div className={`option ${selectedType === types.nature ? 'selected' : ''}`} onClick={() => setSelectedType(types.nature)}><MarkdownRead htmlString={md.renderInline(':sunny:')} /></div>
            <div className={`option ${selectedType === types.objects ? 'selected' : ''}`} onClick={() => setSelectedType(types.objects)}><MarkdownRead htmlString={md.renderInline(':mag_right:')} /></div>
            <div className={`option ${selectedType === types.places ? 'selected' : ''}`} onClick={() => setSelectedType(types.places)}><MarkdownRead htmlString={md.renderInline(':house:')} /></div>
            <div className={`option ${selectedType === types.symbols ? 'selected' : ''}`} onClick={() => setSelectedType(types.symbols)}><MarkdownRead htmlString={md.renderInline(':one:')} /></div>
          </div>
        </div>

        <div className="toggle-layer">
          <div className="toggle-item" onClick={() => setOpen(!open)}><MarkdownRead htmlString={md.renderInline(':smirk:')} /></div>
        </div>
      </div>
      <style jsx>{
        `

        .emoji-picker {
          position: relative;
        }

        .selection-layer {
          position: absolute;
          bottom: 30px;
          z-index: var(--z-index-cover-content);
          background: var(--edge-background);
          box-shadow: var(--shadow-medium);
          display: none;
          width: 300px;
        }

        .selection-layer.open {
          display: block;
        }

        .options {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .option {
          cursor: pointer;
          padding: 5px;
        }

        .option.selected {
          background: var(--accents-1);
        }

        .list {
          display: flex;
          flex-wrap: wrap;
          height: 200px;
          overflow-y: scroll;
          padding: 8px;
        }

        .item {
          padding: 5px;
          cursor: pointer;
        }

        .toggle-item {
          cursor: pointer;
        }
        `
      }</style>
    </>
  )
}