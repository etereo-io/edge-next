import React, { useContext, useEffect } from 'react'

import Button from '@components/generic/button/button'
import { CookiesContext } from '@lib/client/contexts/cookies'

export default function Cookies() {
  const { accepted, accept } = useContext(CookiesContext)

  return (
    <>
      {!accepted && (
        <div className="cookies-wr">
          <div className="cookies-component">
            <div className="cookies-content">
              <p>This website uses cookies </p>
              <div className="cookies-actions">
                <Button onClick={accept}>Accept</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{
        `
        .cookies-wr {
          position: fixed;
          height: 100vh;
          background: rgba(0,0,0,0.3);
          width: 100vw;
          top: 0;
          z-index: 100;
        }
        .cookies-component {
          position: fixed;
          bottom: 0;
          width: 100%;
          background: var(--edge-foreground);
          color: var(--edge-background);
          font-size: 12px;
          padding: var(--edge-gap);
          
        }

        .cookies-content {
          max-width: 500px;
          margin: 0 auto;
        }

        p {
          text-align: center;
        }

        .cookies-actions {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        `
      }</style>
    </>
  )
}