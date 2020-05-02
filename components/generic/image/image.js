import { useState } from 'react'
import ProgressiveImage from './progressive-image'
export default function({ srcs = [], width = 240, height = 240 }) {
  const isMultiple = srcs.length > 1
  const [position, setPosition] = useState(0)
  
  const onClickLeft = () => {
    if (position === 0) {
      setPosition(srcs.length - 1)
    } else {
      setPosition(position - 1 )
    }
  }

  const onClickRight = () => {
    if (position === srcs.length - 1) {
      setPosition(0)
    } else {
      setPosition(position + 1 )
    }
  }

  const hasQuotes = srcs.reduce((prev, next) => prev || typeof next !== 'string' , false)

  const imageHeight = height
  const totalHeight = hasQuotes ? height + 30 : height
  const itemWidth = 100/srcs.length

  return (
    <>
      <div className={`image-wrapper ${isMultiple ? 'multiple': ''}`} style={{maxWidth: '100%', width: width + 'px', maxHeight: `${totalHeight}px`}} >
        {isMultiple && <div onClick={onClickLeft} className="arrow arrow-left">left</div>}
        <div className={`image-container`} style={{ left: `-${100 * position}%`, width: `${srcs.length * 100}%`}} >
          {srcs.map(s => {
            const itemHasQuote = typeof s !== 'string'
            return (
              <div className={`image-item ${itemHasQuote ? 'with-quote': ''}`} style={{ width: `${itemWidth}%`}}>
                <ProgressiveImage alt={itemHasQuote ?  s.quote: s} src={itemHasQuote ? s.url: s} key={itemHasQuote ? s.url: s} height={imageHeight} /> 
                {itemHasQuote && <div className="quote">{s.quote}</div>}
              </div>)
          })}
        </div>
        {isMultiple && <div onClick={onClickRight} className="arrow arrow-right">right</div>}
      </div>

      <style jsx>{`
        .image-wrapper {
          overflow: hidden;
          position: relative;
          width: 100%;
        }

        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: var(--empz-background);
          padding: 5px;
          color: var(--empz-foreground);
          cursor: pointer;
        }

        .arrow-left {
          left: 0;
        }

        .arrow-right {
          right: 0;
        }

        .image-container {
          position: relative;
          display: flex;
          transition: left 300ms linear;
        }
        .image-item {
          
        }

        .quote {
          text-align: center;
          font-size: 13px;

        }
      
      `}</style>
    </>
  )
}
