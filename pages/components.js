import Table, {
  TableCellHeader,
  TableCellBody,
  TableRow,
  TableRowBody,
} from '../components/generic/table/table'

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
    textarea:
      'Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,  Lorem ipsum dolor sit amet,  Lorem ipsum dolor sit amet, ',
    slug: 'the-slug',
    type: 'demo-content-type',
  }

  const demoContentWithImage = {
    title: 'This is an example content',
    img: '/static/demo-images/default-background.jpg',
    slug: 'the-slug',
    type: 'demo-content-type',
  }

  const demoContentType = {
    slug: 'demo-content-type',
    fields: [
      {
        type: 'text',
        name: 'title',
        title: true,
        label: 'title',
      },
      {
        type: 'img',
        name: 'img',
        label: 'img',
      },
      {
        type: 'textarea',
        name: 'textarea',
        label: 'textarea',
      },
    ],
  }

  return (
    <Layout title="Components showcase" fullWidth={true}>
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
            <li className="submenu">
              <a href="#generic">Form elements</a>
              <ul>
                <li>
                  <a>Input text</a>
                </li>
                <li>
                  <a>Input checkbox</a>
                </li>
                <li>
                  <a>Textarea</a>
                </li>
                <li>
                  <a>Select</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#tagsinput">Tags Input</a>
            </li>
            <li>
              <a href="#table">Table</a>
            </li>
          </ul>
        </div>
        <div className="components">
          <h1>Components showcase</h1>

          <div id="drop-menu" className="component">
            <h3>Dropdown menu</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <DropdownMenu align={'left'}>
                  <ul>
                    <li>
                      <Link href="/">
                        <a title="Home">Home</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile">
                        <a title="Home">Profile</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/components">
                        <a title="Components">Components</a>
                      </Link>
                    </li>
                  </ul>
                  <span className="spacer"></span>
                  <h4>Content</h4>
                  <ul>
                    <li>
                      <Link href="/create/post">
                        <a title="New Post">New Post</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/content/post">
                        <a title="Read posts">Read posts</a>
                      </Link>
                    </li>
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
            `}</pre>
          </div>

          <div id="linklist" className="component">
            <h3>Link list</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <LinkList
                  links={[
                    { title: 'test', link: 'test' },
                    { title: 'test', link: 'test' },
                    { title: 'test', link: 'test' },
                  ]}
                />
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
            `}</pre>
          </div>

          <div id="avatar" className="component">
            <h3>Avatar</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Avatar src="/static/demo-images/empieza-avatar.jpg" />
                <Avatar
                  src="/static/demo-images/empieza-avatar.jpg"
                  width={60}
                />
                <Avatar
                  src="/static/demo-images/empieza-avatar.jpg"
                  width={30}
                />
              </div>
              <div className="item-wrapper">
                <Avatar />
                <Avatar width={60} />
                <Avatar width={30} />
              </div>

              <div className="item-wrapper">
                <Avatar loading={true} />
                <Avatar loading={true} width={60} />
                <Avatar loading={true} width={30} />
              </div>
            </div>
            <pre>{`
<Avatar />
            `}</pre>
          </div>

          <div id="button" className="component">
            <h3>Button</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Button>Button</Button>
              </div>

              <div className="item-wrapper">
                <Button loading={true}></Button>
              </div>

              <div className="item-wrapper">
                <Button alt={true}>Button</Button>
              </div>

              <div className="item-wrapper">
                <Button alt={true} loading={true}></Button>
              </div>
            </div>
            <pre>{`
<Button />
            `}</pre>
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
            `}</pre>
          </div>

          <div id="select" className="component">
            <h3>Select</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Select value={'ipsum'}>
                  <option>Lorem</option>
                  <option value="ipsum">Ipsum</option>
                </Select>
              </div>

              <div className="item-wrapper">
                <Select
                  value={'ipsum'}
                  prefixes={[
                    {
                      value: 'lorem',
                      prefix: (
                        <img
                          style={{ maxWidth: '100%' }}
                          src="https://i.picsum.photos/id/519/50/50.jpg"
                        />
                      ),
                    },
                    {
                      value: 'ipsum',
                      prefix: (
                        <img
                          style={{ maxWidth: '100%' }}
                          src="https://i.picsum.photos/id/212/50/50.jpg"
                        />
                      ),
                    },
                  ]}
                >
                  <option value="lorem">Lorem</option>
                  <option value="ipsum">Ipsum</option>
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
            `}</pre>
          </div>

          <div id="themeselector" className="component">
            <h3>Theme Selector</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <ThemeSelector selectedTheme="Robot" />
              </div>
            </div>
            <pre>{`
<ThemeSelector selectedTheme='Light' />
            `}</pre>
          </div>

          <div id="contentsummaryview" className="component">
            <h3>Content Summary View</h3>
            <div className="component-demo">
              <p>
                See <b>Content Types</b> documentation for more details
              </p>
              <div className="item-wrapper">
                <ContentSummaryView
                  type={demoContentType}
                  content={demoContent}
                />
              </div>

              <div className="item-wrapper">
                <ContentSummaryView
                  type={demoContentType}
                  content={demoContentWithImage}
                />
              </div>
            </div>
            <pre>{`
<ContentSummaryView type={demoContentType} content={demoContent} />
            `}</pre>
          </div>

          <div id="generic" className="component">
            <h3>Form Elements</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <select>
                  <option>Example</option>
                </select>
              </div>
              <div className="item-wrapper">
                <input type="text" placeholder="Example input"></input>
              </div>

              <div className="item-wrapper">
                <textarea placeholder="Example textarea"></textarea>
              </div>
            </div>
            <pre>{`
<select><option>Example</option></select>

<input type="text" placeholder="Example input"></input>

<textarea placeholder="Example textarea"></textarea>

            `}</pre>
          </div>

          <div id="tagsinput" className="component">
            <h3>Tags Input</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <TagsInput placeholder="Add some tags" />
              </div>

              <div className="item-wrapper">
                <TagsInput
                  defaultTags={[
                    { label: 'Software', slug: 'software' },
                    { label: 'Web dev', slug: 'web-dev' },
                  ]}
                  placeholder="Your tags"
                />
              </div>
            </div>
            <pre>{`
<TagsInput onChange={} placeholder="Your tags" defaultTags={[{label: 'Something', slug: 'another'}]}/>
  `}</pre>
          </div>

          <div id="table" className="component">
            <h3>Table</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Table
                  headerCells={[
                    <TableCellHeader>User</TableCellHeader>,
                    <TableCellHeader>Email</TableCellHeader>,
                    <TableCellHeader>Last Activity</TableCellHeader>,
                    <TableCellHeader>Actions</TableCellHeader>,
                  ]}
                >
                  <TableRowBody>
                    <TableCellBody>
                      {' '}
                      <Avatar
                        src="/static/demo-images/empieza-avatar.jpg"
                        width={30}
                      />
                      Rafael Ventura
                    </TableCellBody>
                    <TableCellBody>rafael@etereo.io</TableCellBody>
                    <TableCellBody>Today</TableCellBody>
                    <TableCellBody>
                      <Button>Delete</Button>
                    </TableCellBody>
                  </TableRowBody>
                  <TableRowBody>
                    <TableCellBody>
                      {' '}
                      <Avatar
                        src="/static/demo-images/empieza-avatar.jpg"
                        width={30}
                      />
                      Hayder Al-Deen
                    </TableCellBody>
                    <TableCellBody>hayder@etereo.io</TableCellBody>
                    <TableCellBody>Today</TableCellBody>
                    <TableCellBody>
                      <Button>Delete</Button>
                    </TableCellBody>
                  </TableRowBody>
                  <TableRowBody>
                    <TableCellBody>
                      {' '}
                      <Avatar
                        src="/static/demo-images/empieza-avatar.jpg"
                        width={30}
                      />
                      Rafael Ventura
                    </TableCellBody>
                    <TableCellBody>rafael@etereo.io</TableCellBody>
                    <TableCellBody>Today</TableCellBody>
                    <TableCellBody>
                      <Button>Delete</Button>
                    </TableCellBody>
                  </TableRowBody>
                  <TableRowBody>
                    <TableCellBody>
                      {' '}
                      <Avatar
                        src="/static/demo-images/empieza-avatar.jpg"
                        width={30}
                      />
                      Hayder Al-Deen
                    </TableCellBody>
                    <TableCellBody>hayder@etereo.io</TableCellBody>
                    <TableCellBody>Today</TableCellBody>
                    <TableCellBody>
                      <Button>Delete</Button>
                    </TableCellBody>
                  </TableRowBody>
                  <TableRowBody>
                    <TableCellBody>
                      {' '}
                      <Avatar
                        src="/static/demo-images/empieza-avatar.jpg"
                        width={30}
                      />
                      Rafael Ventura
                    </TableCellBody>
                    <TableCellBody>rafael@etereo.io</TableCellBody>
                    <TableCellBody>Today</TableCellBody>
                    <TableCellBody>
                      <Button>Delete</Button>
                    </TableCellBody>
                  </TableRowBody>
                </Table>

                {/*
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className="table-header">User</span>
                      </th>
                      <th scope="col">
                        <span className="table-header">Role</span>
                      </th>
                      <th scope="col">
                        <span className="table-header">Last Activity</span>
                      </th>
                      <th scope="col">
                        <span className="table-header">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody aria-live="polite">
                    <tr>
                      <td>
                        <Avatar
                          src="/static/demo-images/empieza-avatar.jpg"
                          width={30}
                        />
                        Rafael Ventura
                      </td>
                      <td>Admin</td>
                      <td>Today</td>
                      <td><Button>Delete</Button></td>
                    </tr>
                    <tr>
                      <td>
                        <Avatar
                          src="/static/demo-images/empieza-avatar.jpg"
                          width={30}
                        />
                        Rafael Ventura
                      </td>
                      <td>Admin</td>
                      <td>Today</td>
                      <td><Button>Delete</Button></td>
                    </tr>
                    <tr>
                      <td>
                        <Avatar
                          src="/static/demo-images/empieza-avatar.jpg"
                          width={30}
                        />
                        Rafael Ventura
                      </td>
                      <td>Admin</td>
                      <td>Today</td>
                      <td><Button>Delete</Button></td>
                    </tr>
                    <tr>
                      <td>
                        <Avatar
                          src="/static/demo-images/empieza-avatar.jpg"
                          width={30}
                        />
                        Rafael Ventura
                      </td>
                      <td>Admin</td>
                      <td>Today</td>
                      <td><Button>Delete</Button></td>
                    </tr>
                    <tr>
                      <td>
                        <Avatar
                          src="/static/demo-images/empieza-avatar.jpg"
                          width={30}
                        />
                        Rafael Ventura
                      </td>
                      <td>Admin</td>
                      <td>Today</td>
                      <td><Button>Delete</Button></td>
                    </tr>
                  </tbody>
                </table>*/}
              </div>
            </div>
            <pre>{`
<Table headerCells={[<TableCell>Name</TableCell>, <TableCell>Email</TableCell>, <TableCell>Actions</TableCell>]}>
<TableRow key="1">
<TableCell>User</TableCell>
<TableCell>user@user.com</TableCell>
<TableCell><Button>Delete</Button></TableCell>
</TableRow>
<TableRow key="2">
<TableCell>User</TableCell>
<TableCell>user@user.com</TableCell>
<TableCell><Button>Delete</Button></TableCell>
</TableRow>
</Table>
  `}</pre>
          </div>
        </div>
      </div>
      <style jsx>{`
        table {
          border-collapse: collapse;
          border-spacing: 0;
          font-size: 14px;
          width: 100%;
        }

        table tr {
          border: none;
          height: var(--cds-layout-04, 3rem);
          transition: 0.3s ease;
          width: 100%;
        }

        table tr:hover {
          background: var(--accents-2);
        }

        table thead {
          background: var(--accents-2);
          z-index: 1;
        }

        table thead th {
          background: var(--accents-2)
          border-bottom: 1px solid rgba(0,0,0,0.1);
          padding: var(--empz-gap-half);
          position: sticky;
          top: 0;
        }

        table td {
          border-bottom: 1px solid var(--accents-2);
          padding: var(--empz-gap-half);
          white-space: nowrap;
        }

        table tr:first-of-type td {
          border-top: 1px solid var(--accents-2);
        }

        table th {
          text-align: left;
        }
        h1 {
          padding-left: var(--empz-gap-double);
          margin-bottom: var(--empz-gap);
        }
        .components-layout {
          align-items: flex-start;
          display: flex;
          flex-wrap: wrap;
        }

        @media (max-width: 780px) {
          .components-layout {
            flex-direction: column;
          }
        }

        .list-menu {
          background: var(--accents-1);
          overflow: scroll;
          position: sticky;
          top: 56px;
          padding: var(--empz-gap-double);
          box-sizing: border-box;
          height: 100vh;
          z-index: 3;
        }

        .list-menu .submenu a::after {
          background: transparent;
          border-bottom: 2px solid var(--accents-6);
          border-right: 2px solid var(--accents-6);
          content: '';
          display: inline-block;
          height: 8px;
          margin: 0 0 2px 8px;
          transform: rotate(45deg);
          transform-origin: 50% 50%;
          transition: 0.3s ease;
          width: 8px;
        }

        .list-menu .submenu ul li a::after {
          display: none;
        }

        .list-menu .submenu ul {
          max-height: 0;
          border-left: 2px solid var(--accents-2);
          opacity: 0;
          overflow: hidden;
          transition: 0.3s ease;
          padding-left: var(--empz-gap-half);
          margin-left: var(--empz-gap-half);
          visibility: hidden;
        }

        .list-menu .submenu:hover ul {
          max-height: 260px;
          opacity: 1;
          visibility: visible;
        }

        .list-menu .submenu:hover a::after {
          transform: rotate(-135deg) translate(-2px, -2px);
        }

        .list-menu h3 {
          padding: var(--empz-gap-half) 0 var(--empz-gap);
        }

        .list-menu ul {
          list-style: none;
        }

        .list-menu li a {
          color: var(--accents-6);
          font-size: 14px;
          font-weight: 500;
          padding: var(--empz-gap-half);
          display: block;
          text-decoration: none;
        }

        .list-menu li a:hover {
          background: var(--accents-2);
          border-radius: var(--empz-radius);
        }

        .components {
          padding: var(--empz-gap-double);
          background: var(--empz-background);
          color: var(--empz-foreground);
          margin-left: var(--empz-gap);
          max-width: var(--empz-page-extra-width);
          flex: 1;
        }

        .item-wrapper {
          margin-top: var(--empz-gap);
          margin-bottom: var(--empz-gap);
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .components pre {
          background: var(--empz-background);
          box-sizing: border-box;
          color: var(--accents-5);
          padding: var(--empz-gap-double) var(--empz-gap) var(--empz-gap);
          border: 1px solid var(--accents-2);
          border-radius: var(--empz-radius);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          position: relative;
          white-space: pre-wrap;
          word-wrap: break-word;
          text-align: justify;
        }

        .components pre::before {
          border-top-left-radius: var(--empz-radius);
          border-top-right-radius: var(--empz-radius);
          box-sizing: border-box;
          content: 'Code';
          position: absolute;
          top: 0;
          left: 0;
          padding: 8px var(--empz-gap);
          background: var(--accents-1);
          width: 100%;
        }

        @media (max-width: 780px) {
          .components pre {
            margin: 0;
            padding: 16px;
          }

          .components {
            margin: 0;
          }
        }

        .component {
          padding: calc(var(--empz-gap-double) * 1.6) var(--empz-gap-double)
            var(--empz-gap-double);
        }

        .component h3  {
          font-size: 24px;
        }

        .component p {
          color: var(--accents-4);
          display: block;
          padding-top: var(--empz-gap-half);
        }

        @media all and (max-width: 960px) {
          .list-menu {
            position: fixed;
            transform: translateX(-100%);
          }

          .components {
            margin-left: 0;
            padding: var(--empz-gap-double) 0;
          }
        }
      `}</style>
    </Layout>
  )
}

export default Components
