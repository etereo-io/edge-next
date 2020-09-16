import React, { memo } from 'react'

import { Tab } from '../types'
import cx from 'classnames'

export interface Props {
  tabs: Tab[]
  value: number | string
  onChange: (event: React.ChangeEvent<{}>, value: number | string) => void
  className?: string
}

const Tabs: React.FC<Props> = ({ tabs, value, onChange, className }) => {
  const showTabs = tabs.find((tab) => tab.id === value && tab.show !== false)

  return (
    <>
      {showTabs && (
        <>
          <ul className={cx('navigation', className)}>
            {tabs.map(
              ({ id, label, counter, disabled = false, show = true }) =>
                show && (
                  <li
                    onClick={(e) => onChange(e, id)}
                    key={id}
                    className={cx({ active: value === id, disabled })}
                    value={id}
                  >
                    <a>
                      <span>{label}</span>
                      {counter ? <span>({counter})</span> : null}
                    </a>
                   
                  </li>
                )
            )}
          </ul>
          {tabs.map(
            ({ content = '', id, disabled }) =>
              value === id &&
              !disabled && (
                <div key={id} className="navigation-tab active">
                  {content}
                </div>
              )
          )}
        </>
      )}

      <style jsx>
        {`
          .navigation {
            background: var(--edge-background);
            border-bottom: 1px solid var(--accents-2);
            display: flex;
            justify-content: space-between;
            padding: var(--edge-gap-double);
            padding-bottom: 0;
            position: sticky;
            top: 80px;
            z-index: 2;
          }

          @media all and (max-width: 720px) {
            .navigation {
              padding: 0;
            }
          }

          .navigation li {
            cursor: pointer;
            height: 100%;
            list-style: none;
            padding-bottom: var(--edge-gap-half);
          }

          .navigation li a {
            color: var(--accents-3);
            font-size: 12px;
            font-weight: 500;
            text-decoration: none;
            text-transform: uppercase;
          }

          .navigation li.active {
            border-bottom: 2px solid var(--edge-foreground);
          }

  

          .navigation-tab {
            height: 0;
            overflow: hidden;
            padding: 0;
            transition: opacity 0.65s ease;
          }

          .navigation-tab.active {
            height: auto;
            padding: var(--edge-gap-double);
          }

          @media all and (max-width: 720px) {
            .navigation-tab.active {
              padding: var(--edge-gap);
              padding-bottom: 0;
            }

          }

          @media all and (max-width: 460px) {
            .navigation-tab.active {
              padding: var(--edge-gap) 0;
            }
          }

          @media all and (max-width: 820px) {
            .navigation {
              padding-top: var(--edge-gap);
            }
          }
          .disabled {
            pointer-events:none; //This makes it not clickable
            opacity:0.6;         //This grays it out to look disabled
          }
        `}
      </style>
    </>
  )
}

export default memo(Tabs)
