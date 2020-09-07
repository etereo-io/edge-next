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
          }

          li {
            margin-right: var(--edge-gap);
            margin-bottom: var(--edge-gap);
          }

          a {
            border: var(--light-border);
            padding: var(--edge-gap);
            color: var(--edge-link-color);
            text-decoration: none;
            display: block;
            border-radius: var(--edge-radius);
          }
          
          .space-evenly ul {
            justify-content: space-evenly;
          }
         
        `}
      </style>
    </>
  )
}

export default memo(Links)
