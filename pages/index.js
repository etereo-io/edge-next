import Layout from '../components/layout/normal/layout'
import Button from '../components/generic/button/button'
import GithubLogo from '../components/generic/icons/github-icon/github-icon'
import NextJSLogo from '../components/generic/icons/nextjs-icon/nextjs-icon'
import Link from 'next/link'
import config from '../lib/config'

const Landing = (props) => {


  return (
    <>
    <Layout title="Landing page" fullWidth>
      
      <div className="hero">
        <div className="hero-head-line">
          <h1 className="slogan">{config.slogan}</h1>
          <div className="call-to-action">
            <div className="call-to-action-item">
              <Button alt href="/components">See all components</Button>
            </div>
            <div className="call-to-action-item">
              <Button href="/content/post">Blazing fast dynamic content</Button>
            </div>
          </div>
          
        </div>
      </div>

      <div className="separator">
        <div><span>created by </span> <a href="https://nucleo.dev">the Nucleo Team</a></div>
      </div>
      <div className="powered-by">
        <span>powered by</span>
        <NextJSLogo />
      </div>

      <div className="source-code">
        <span>source code on </span> <GithubLogo/>
      </div>

      <h2>Features</h2>
      <div className="features">
        <div className="feature">
          <h3>Dynamic API</h3>
          <p>
            A dynamic API for your content and comments based on a configuration file. 
            Content forms are updated automaticaly based on your settings, allowing the users to create any kind of content.
          </p>
        </div>
        <div className="feature">
          <h3>Custom Permissions and Roles</h3>
          <p>
            Add custom permissions based on roles for each API endpoint and app pages.
            Create and configure new roles to extend the default functionality.
          </p>
        </div>
        <div className="feature">
          <h3>Built-in admin dashboard</h3>
          <p>
            A simple admin dashboard to list and edit all the content, comments and users of the platform.
          </p>
        </div>
        <div className="feature">
          <h3>Built-in CSS Themes</h3>
          <p>
            Four CSS themes implemented (Light, Dark, Robot, Kawai), stored in cookies for each user preference.
            Easily create and add new themes.
          </p>
        </div>
        <div className="feature">
          <h3>SSG (Static Site Generation)</h3>
          <p>
            Built-in static pages through Markdown rendering, check <Link href="/p/faq"><a>some</a></Link> <Link href="/p/privacy-policy"><a>example</a></Link> <Link href="/p/terms-of-service"><a>pages</a></Link>
          </p>
        </div>
        <div className="feature">
          <h3>User Activity</h3>
          <p>
            Record and display user activity through api hooks. 
          </p>
        </div>
        <div className="feature">
          <h3>Coded Components</h3>
          <p>
            A set of ready to use and fully integrated and themed <Link href="/components"><a>components</a></Link> 
          </p>
        </div>

        <div className="feature">
          <h3>Emails</h3>
          <p>
            Email verification, password recovery and notifications through emails already implemented.
          </p>
        </div>
        
        <div className="feature">
          <h3>Social Providers</h3>
          <p>
            Login and register implemented for different social providers like Instagram, Google, Facebook, Twitch and many more.
          </p>
        </div>
        
        <div className="feature">
          <h3>Next + React + Serverless</h3>
          <p>
            A modern setup easily deployable on platforms like <a href="https://vercel.com">Vercel.com</a>
          </p>
        </div>

        <div className="feature">
          <h3>Documented</h3>
          <p>
            Important information on how to deploy and configure your site in the <Link href="/p/documentation"><a>documentation</a></Link> 
          </p>
        </div>
        <div className="feature">
          <h3>Any MongoDB or Firebase database</h3>
          <p>
            A database layer abstracts the usage of any MongoDB database or Firebase. 
          </p>
        </div>
        <div className="feature">
          <h3>Integration test</h3>
          <p>
            A set of integration tests cover different paths and can be easily extended
          </p>
        </div>
      </div>


      <h2>Use cases</h2>
      <div className="use-cases">

        <div className="use-case">
          <h3>Social Page</h3>
          <p>
            Allow users to register and post content of any kind
          </p>
        </div>

        <div className="use-case">
          <h3>API</h3>
          <p>
            Need a quick API and admin dashboard for your product? Use <b>Edge</b>
          </p>
        </div>
      </div>
    </Layout>
    <style jsx>{
      `
      .hero {
        padding-top: 100px;
        padding-bottom: 100px;
        background: linear-gradient(-45deg, var(--empz-foreground), var(--empz-background), var(--empz-background), var(--empz-foreground));
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }

      @media (max-width: 600px) {
        .hero {
          padding-top: 50px;
          padding-bottom: 50px;
        }
      }

      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      .call-to-action {
        display: flex;
        flex-wrap: wrap;
      }

      .call-to-action .call-to-action-item {
        margin-right: var(--empz-gap);
      }

      @media (max-width: 600px) {
        .call-to-action {
          flex-direction: column;
        }

        .call-to-action-item {
          width: 100%;
          dispay: flex;
          align-items: center;
          margin-bottom: var(--empz-gap);
        }
      }
      
      .hero-head-line {
        max-width: 1024px;
        margin: 0 auto;
        padding var(--empz-gap);
      }

      .slogan {
        font-size: 3.5rem; 
        font-weight: 400;
        letter-spacing: -.02em;
        line-height: 130%;
        margin-bottom: 30px;
        color: var(--empz-foreground);
      }

      @media (max-width: 600px) {
        .slogan {
          font-size: 1.5rem;
        }
      }

      .powered-by, .source-code {
        color: var(--empz-foreground);
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: var(--empz-gap-double);
      }

      .separator {
        height: 100px;
        margin-bottom: var(--empz-gap-double);
        background: var(--empz-foreground);
        color: var(--empz-background);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--empz-gap);
      }

      .separator a {
        color: var(--empz-background);
      }

      h2 {
        text-align: center;
      }

      .features, .use-cases {
        max-width: 1024px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0 auto;
        padding var(--empz-gap);
      }

      .feature, .use-case {
        width: 30%;
        padding: 15px;
        margin: 30px 0px;
        background: var(--accents-2);
      }

      @media (max-width: 600px) {
        .features, .use-cases {
          flex-direction: column;
        }

        .feature, .use-case {
          width: 100%;
        }
      }
      `
    }</style>
    </>
  )
}

export default Landing
