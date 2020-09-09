import Link from 'next/link'
import React, { memo } from 'react'

function Links({ links, className = '' }) {
  return (
    <>
      <div className={className}>
        <ul>
          {links.map((i) => (
            <li key={i.title}>
              <Link href={i.link}>
                <a title={i.title}>{i.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>
        {`
          ul {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            width: 100%;
          }

          li {
            font-size: 13px;
            padding: 0 16px;
          }
         
        `}
      </style>
    </>
  )
}

export default memo(Links)
