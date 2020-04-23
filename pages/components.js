import Avatar from '../components/user/avatar/avatar'
import Button from '../components/generic/button/button'
import ContentSummaryView from '../components/content/read-content/content-summary-view/content-summary-view'
import DropdownMenu from '../components/generic/dropdown-menu/dropdown-menu'
import Layout from '../components/layout/normal/layout'
import Link from 'next/link'
import LinkList from '../components/generic/link-list/link-list'
import Select from '../components/generic/select/select'
import SocialShare from '../components/generic/social-share/social-share'
import TagsInput from '../components/generic/tags-input/tags-input'
import ThemeSelector from '../components/generic/theme-selector/theme-selector'

const Components = () => {
  const demoContent = {
    title: 'This is an example content',
    textarea: 'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,  Lorem ipsum dolor sit amet,  Lorem ipsum dolor sit amet, ',
    slug: 'the-slug',
    type: 'demo-content-type'
  }

  const demoContentWithImage = {
    title: 'This is an example content',
    img: 'https://i.picsum.photos/id/400/200/200.jpg',
    slug: 'the-slug',
    type: 'demo-content-type'
  }

  const demoContentType = {
    slug: 'demo-content-type',
    fields: [{
      type: 'text',
      name: 'title',
      title: true,
      label: 'title'
    }, {
      type: 'img',
      name: 'img',
      label: 'img'
    }, {
      type: 'textarea',
      name: 'textarea',
      label: 'textarea'
    }]
  }

  return (
    <Layout title="Components showcase">
      <h1>Components showcase</h1>
      <div className="components-layout">
        <div className="list-menu">
          <ul>
            <li>
              <a href="#drop-menu">Dropdown menu</a>
            </li>
            <li>
              <a href="#linklist">Link list</a>
            </li>
            <li>
              <a href="#avatar">Avatar</a>
            </li>
            <li>
              <a href="#button">Button</a>
            </li>
            <li>
              <a href="#socialshare">Social Share</a>
            </li>
            <li>
              <a href="#themeselector">Theme selector</a>
            </li>
            <li>
              <a href="#contentsummaryview">Content Summary View</a>
            </li>
            <li>
              <a href="#tagsinput">Tags Input</a>
            </li>
          </ul>
        </div>
        <div className="components">
          
          <div id="drop-menu" className="component">
            <h3>Dropdown menu</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <DropdownMenu align={'left'}>
                  <ul>
                    <li><Link href="/" ><a title="Home">Home</a></Link></li>
                    <li><Link href="/profile" ><a title="Home">Profile</a></Link></li>
                    <li><Link href="/components" ><a title="Components">Components</a></Link></li>
                  </ul>
                  <span className="spacer"></span>
                  <h4>Content</h4>
                  <ul>
                    <li><Link href="/create/post" ><a title="New Post">New Post</a></Link></li>
                    <li><Link href="/content/post" ><a title="Read posts">Read posts</a></Link></li>
                  </ul>
                </DropdownMenu>
              </div>
            </div>
            <pre>{`
<DropdownMenu>
  <ul>
    <li><Link href="/" ><a title="Home">Home</a></Link></li>
    <li><Link href="/profile" ><a title="Home">Profile</a></Link></li>
    <li><Link href="/components" ><a title="Components">Components</a></Link></li>
  </ul>
  <span className="spacer"></span>
  <h4>Content</h4>
  <ul>
    <li><Link href="/create/post" ><a title="New Post">New Post</a></Link></li>
    <li><Link href="/content/post" ><a title="Read posts">Read posts</a></Link></li>
  </ul>
</DropdownMenu>
            `           
            }</pre>
          </div>

          <div id="linklist" className="component">
            <h3>Link list</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <LinkList links={[{title: 'test', link: 'test'}, {title: 'test', link: 'test'}, {title: 'test', link: 'test'}]} />
              </div>
            </div>
            <pre>{`
const links = [{
  title: 'test',
  link: 'test
}, {
  title: 'test',
  link: 'test
}]

<LinkList links={links} />
            `           
            }</pre>
          </div>


          <div id="avatar" className="component">
            <h3>Avatar</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Avatar />
                <Avatar width={60}/>
                <Avatar width={30}/>
              </div>
              <div className="item-wrapper">
                <Avatar loading={true}/>
                <Avatar loading={true} width={60}/>
                <Avatar loading={true} width={30}/>
              </div>
              <div className="item-wrapper">
                <Avatar src="/static/demo-images/profile.jpeg" />
                <Avatar src="/static/demo-images/profile.jpeg" width={60}/>
                <Avatar src="/static/demo-images/profile.jpeg" width={30} />
              </div>
            </div>
            <pre>{`
<Avatar />
            `           
            }</pre>
          </div>


          <div id="button" className="component">
            <h3>Button</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Button >Button</Button>
              </div>

              <div className="item-wrapper">
                <Button loading={true}></Button>
              </div>
              

              <div className="item-wrapper">
                <Button alt={true} >Button</Button>
              </div>

              <div className="item-wrapper">
                <Button alt={true} loading={true}></Button>
              </div>
              
            </div>
            <pre>{`
<Button />
            `           
            }</pre>
          </div>


          <div id="socialshare" className="component">
            <h3>Social Share</h3>
            <div className="component-demo">
              <p>shareUrl defaults to window.location</p>
              <div className="item-wrapper">
                <SocialShare />
              </div>
              
            </div>
            <pre>{`
<SocialShare shareUrl='' />
            `           
            }</pre>
          </div>

          <div id="select" className="component">
            <h3>Select</h3>
            <div className="component-demo">
              
              <div className="item-wrapper">
                <Select value={'ipsum'}>
                  <option>Lorem</option>
                  <option value='ipsum'>Ipsum</option>
                </Select>
              </div>

              <div className="item-wrapper">
                
                <Select value={'ipsum'} prefixes={[{
                  value: 'lorem',
                  prefix: <img style={{maxWidth: '100%' }} src="https://i.picsum.photos/id/519/50/50.jpg" />
                }, {
                  value: 'ipsum',
                  prefix: <img style={{maxWidth: '100%' }}  src="https://i.picsum.photos/id/212/50/50.jpg" />
                }]}>
                  <option value='lorem'>Lorem</option>
                  <option value='ipsum'>Ipsum</option>
                </Select>
              </div>
              
            </div>
            <pre>{`
<Select name='' onChange={} >
  <option value="something">Something</option>
</Select>


<Select value={'ipsum'} prefixes={[{
  value: 'lorem',
  prefix: <img style={{'max-width': '100%' }} src="https://i.picsum.photos/id/519/50/50.jpg" />
}, {
  value: 'ipsum',
  prefix: <img style={{'max-width': '100%' }}  src="https://i.picsum.photos/id/212/50/50.jpg" />
}]}>
  <option value='lorem'>Lorem</option>
  <option value='ipsum'>Ipsum</option>
</Select>
            `           
            }</pre>
          </div>

          <div id="themeselector" className="component">
            <h3>Theme Selector</h3>
            <div className="component-demo">
              
              <div className="item-wrapper">
                <ThemeSelector selectedTheme='Robot'/>
              </div>
              
            </div>
            <pre>{`
<ThemeSelector selectedTheme='Light' />
            `           
            }</pre>
          </div>

          <div id="contentsummaryview" className="component">
            <h3>Content Summary View</h3>
            <div className="component-demo">
              <p>See <b>Content Types</b> documentation for more details</p>
              <div className="item-wrapper">
                <ContentSummaryView type={demoContentType} content={demoContent} />
              </div>

              <div className="item-wrapper">
                <ContentSummaryView type={demoContentType} content={demoContentWithImage} />
              </div>
              
            </div>
            <pre>{`
<ContentSummaryView type={demoContentType} content={demoContent} />
            `           
            }</pre>
          </div>

          <div id="tagsinput" className="component">
            <h3>Tags Input</h3>
            <div className="component-demo">
              
              <div className="item-wrapper">
                <TagsInput placeholder="Add some tags"/>
              </div>

              <div className="item-wrapper">
                <TagsInput defaultTags={[{label: 'Software', slug:'software'}, {label: 'Web dev', slug: 'web-dev'}]} placeholder="Your tags"/>
              </div>
              
            </div>
            <pre>{`
<TagsInput onChange={} placeholder="Your tags" defaultTags={[{label: 'Something', slug: 'another'}]}/>
            `           
            }</pre>
          </div>

        </div>

      </div>
      <style jsx>{`
        h1 {
          margin-bottom: var(--empz-gap);
        }
        .components-layout {
          display: flex;
          flex-wrap: wrap;
        }

        @media (max-width: 780px) {
          .components-layout {
            flex-direction: column;
          }
        }

        .list-menu {
          background: var(--empz-background);
          color: var(--empz-foreground);
          border: var(--light-border);
          border-radius: var(--empz-radius);
        }

        .list-menu ul{
          list-style: none;
        }

        .list-menu li a {
          padding: var(--empz-gap);
          display: block;
          text-decoration: none;
          color: var(--empz-link-color);
          border: var(--light-border);
        }

        .components {
          padding: var(--empz-gap);
          background: var(--empz-background);
          color: var(--empz-foreground);
          border: var(--light-border);
          border-radius: var(--empz-radius);
          margin-left: var(--empz-gap);
          flex: 1;
        }

        .item-wrapper {
          margin-top: var(--empz-gap);
          margin-bottom: var(--empz-gap);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .components pre {
          background: var(--empz-foreground);
          color: var(--empz-background);
          padding: var(--empz-gap);
          border: 1px solid var(--empz-background);
          border-radius: var(--empz-radius);
          margin: var(--empz-gap);
          font-size: 13px;
          overflow-x: scroll;
          white-space: pre-wrap;
          word-wrap: break-word;
          text-align: justify;
        }

        @media (max-width: 780px) {
          .components pre {
            max-width: 80vw;
            margin: 0;
            padding: 5px;
          }

          .components {
            margin: 0;
          }
        }

        .component {
          border-bottom: var(--light-border);
          margin-bottom: var(--empz-gap);
          padding-bottom: var(--empz-gap);
        }
      `}</style>
    </Layout>
  )
}

export default Components
