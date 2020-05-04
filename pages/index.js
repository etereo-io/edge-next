import Layout from '../components/layout/normal/layout'
import Button from '../components/generic/button/button'
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

      <div className="separator"></div>

      <div className="features">
        <h2>Features</h2>
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


      <div className="use-cases">
        <h2>Use cases</h2>

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
        margin-right: 15px;
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

      .separator {
        height: 100px;
        margin-bottom: 30px;
        background: var(--empz-foreground);
      }
      .features, .use-cases {
        max-width: 1024px;
        margin: 0 auto;
        padding var(--empz-gap);
      }

      .feature, .use-case {
        margin: 30px 0px;
      }
      `
    }</style>
    </>
  )
}

export default Landing
