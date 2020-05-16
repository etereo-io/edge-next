import Layout from '../components/layout/normal/layout'
import Button from '../components/generic/button/button'
import GithubLogo from '../components/generic/icons/github-icon/github-icon'
import NextJSLogo from '../components/generic/icons/nextjs-icon/nextjs-icon'
import Badge from '../components/generic/badge/badge'
import Link from 'next/link'
import config from '../lib/config'
import { useContentType } from '../lib/client/hooks'
import ContentListView from '../components/content/read-content/content-list-view/content-list-view'

const Landing = (props) => {
  const { contentType } = useContentType('post')
  return (
    <>
      <Layout title={`${config.title} - ${config.slogan}`} description={config.slogan} fullWidth>
        <div className="columns">
          <div className="left-column">

          </div>
          <div className="center-column">
            { contentType && <ContentListView
              type={contentType}
            />
            }
          </div>

          <div className="right-column">
             <div className="call-to-action-item">
                <Button alt href="/components">
                  See all components
                </Button>
              </div>
              <div className="call-to-action-item">
                <Button href="/content/post">
                  Blazing fast dynamic content
                </Button>
              </div>
              <div className="call-to-action-item">
                <Button success href="https://webmonetization.org/" padding={'none'}>
                  <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px 10px'}}>Web monetization enabled <img alt="web monetization" width={'30px'} src="/static/logos/wm-icon-animated.svg" /></span>
                </Button>
              </div>
              <div className="badges">
                <Badge success>SEO 100</Badge>{' '}
                <Badge success>Accessibility 100</Badge>{' '}
                <Badge success>PWA</Badge>
              </div>
              <div className="powered-by">
                <span>powered by</span>
                <a
                  href="https://nextjs.org/"
                  title="NextJS website"
                  rel="noopener"
                  target="_blank"
                >
                  <NextJSLogo />
                </a>
              </div>

              <div className="source-code">
                <span>source code on </span>{' '}
                <a
                  href="https://github.com/nucleo-org/edge-next"
                  rel="noopener"
                  target="_blank"
                  title="Source code"
                >
                  <GithubLogo />
                </a>
              </div>

          </div>
        </div>
     
        
      </Layout>
      <style jsx>{`

      .columns {
        display: flex;
        flex-wrap: wrap;
      }

      .left-column, .right-column {
        width: 20%
        padding: var(--empz-gap);
      }

      .center-column {
        width: 60%;
        padding: var(--empz-gap);
      }
     
      .call-to-action {
        display: flex;
        flex-wrap: wrap;
      }

   
      .badges {
        display: flex;
        align-items: center;
        justify-content: space-around;
        max-width: 300px;
        margin: 0 auto;
        margin-top: 90px;

      }

      .powered-by, .source-code {
        color: var(--empz-foreground);
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: var(--empz-gap-double);
      }

      .source-code a, .powered-by a {
        color: var(--empz-foreground);
      }

     
      h2 {
        text-align: center;
      }

      
      `}</style>
    </>
  )
}

export default Landing
