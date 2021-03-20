import React, { useContext, useEffect } from 'react'

import Button from '@components/generic/button/button'
import { CookiesContext } from '@lib/client/contexts/cookies-context'
import Link from 'next/link'

export default function Cookies() {
  const { accepted, accept, cookies, setCookies } = useContext(CookiesContext)

  const onClickAccept = () => {
    if (cookies.functional) {
      accept()
    }
  }

  const onClickAcceptAll = () => {
    setCookies({
      functional: true,
      statistics: true
    })
    accept()
  }

  const onClickReject = () => {
    alert('Rejecting cookies will not allow you to use this site. We are sorry for the inconvenience.')
  }
  
  return (
    <>
      {!accepted && (
        <div className="cookies-wr">
          <div className="cookies-component">
            <div className="cookies-content">
              <div className="text">
                <p>This website uses cookies to work properly and to improve the service. You can check our <Link href="/p/cookies-policy" ><a title="Cookies Policy"> Cookies Policy</a></Link></p>
              </div>
              <div className="config">
                <div className="config-item">
                  <label>Functional cookies<input type="checkbox" checked={cookies.functional} onClick={() => {
                    setCookies({...cookies, functional: !cookies.functional})
                  }}/></label>
                </div>
                <div className="config-item">
                  <label>Analytics Cookies<input type="checkbox" checked={cookies.statistics} onClick={() => {
                    setCookies({...cookies, statistics: !cookies.statistics})
                  }}/></label>
                </div>
              </div>
              <div className="cookies-actions">
                <div className="button-wr">
                  <Button title="Accept cookies" onClick={onClickAcceptAll}>Accept All</Button>
                </div>
                <div className="button-wr">
                  <Button title="Accept configured cookies" secondary  onClick={onClickAccept}>Accept configured cookies</Button>
                </div>

              </div>
              <div className="cookies-actions">
                <div className="button-wr">
                  <Button title="Reject Cookies" onClick={onClickReject}>Reject cookies</Button>
                </div>
               
                
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

        a {
          color: var(--edge-fonce-red);
        }

        .cookies-content {
          margin: 0 auto;
          max-width: 800px;
        }

        .text {
          margin-bottom: 15px;
        }

        .cookies-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 15px;
        }

        @media all and (max-width: 720px) {
          .cookies-actions {
            flex-direction: column;
          }
        }


        .button-wr {
          margin: 15px;
        }

        .config-item input {
          width: auto;
          margin-left: 5px;
        }

        .config-item {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        `
      }</style>
    </>
  )
}