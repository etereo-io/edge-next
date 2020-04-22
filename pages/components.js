import Avatar from '../components/user/avatar/avatar'
import Button from '../components/generic/button/button'
import DropdownMenu from '../components/generic/dropdown-menu/dropdown-menu'
import Layout from '../components/layout/normal/layout'
import Link from 'next/link'
import LinkList from '../components/generic/link-list/link-list'
import Select from '../components/generic/select/select'
import SocialShare from '../components/generic/social-share/social-share'
import ThemeSelector from '../components/generic/theme-selector/theme-selector'

const Components = () => {
  

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

        </div>

      </div>
      <style jsx>{`
        h1 {
          margin-bottom: 15px;
        }
        .components-layout {
          display: flex;
        }

        .list-menu {
          background: white;
          border: 1px solid rgba(0,0,0,0.2);
          border-radius: 4px;
        }

        .list-menu ul{
          list-style: none;
        }

        .list-menu li a {
          padding: 15px;
          display: block;
          color: black;
          text-decoration: none;
          border-bottom: 1px solid rgba(0,0,0, 0.2);
        }

        .components {
          padding: 15px;
          background: white;
          border: 1px solid rgba(0,0,0,0.2);
          border-radius: 4px;
          margin-left: 15px;
          flex: 1;
        }

        .item-wrapper {
          margin-top: 15px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .components pre {
          background: grey;
          color: white;
          padding: 15px;
          border: 1px solid black;
          border-radius: 4px;
          margin: 15px;
          font-size: 13px;
        }

        .component {
          border-bottom: 1px solid rgba(0,0,0,0.2);
          margin-bottom: 15px;
          padding-bottom: 15px;
        }
      `}</style>
    </Layout>
  )
}

export default Components
