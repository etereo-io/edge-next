import DropdownMenu from '../components/generic/dropdown-menu/dropdown-menu'
import Layout from '../components/layout/normal/layout'
import Link from 'next/link'
import LinkList from '../components/generic/link-list/link-list'

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
              <a href="#activity">Activity List</a>
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
