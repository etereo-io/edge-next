import Table, {
  TableCellBody,
  TableCellHeader,
  TableRowBody,
} from '@components/generic/table/table'

import AuthorBox from '@components/user/author-box/author-box'
import Avatar from '@components/user/avatar/avatar'
import Badge from '@components/generic/badge/badge'
import Button from '@components/generic/button/button'
import Card from '@components/generic/card/card'
import ContentSummaryView from '@components/content/read-content/content-summary-view/content-summary-view'
import DropdownMenu from '@components/generic/dropdown-menu/dropdown-menu'
import DynamicField from '@components/generic/dynamic-field/dynamic-field-edit'
import DynamicFieldView from '@components/generic/dynamic-field/dynamic-field-view'
import Image from '@components/generic/image/image'
import Layout from '@components/layout/normal/layout'
import Link from 'next/link'
import LinkList from '@components/generic/link-list/link-list'
import Loading from '@components/generic/loading/loading-spinner/loading-spinner'
import LoadingPlaceholder from '@components/generic/loading/loading-placeholder/loading-placeholder'
import Map from '@components/generic/map/map'
import PasswordStrength from '@components/generic/password-strength/password-strength'
import Select from '@components/generic/select/select'
import SocialShare from '@components/generic/social-share/social-share'
import TagsField from '@components/generic/tags-field/tags-field'
import TagsInput from '@components/generic/tags-input/tags-input'
import ThemeSelector from '@components/generic/theme-selector/theme-selector'
import Toggle from '@components/generic/toggle/toggle'
import Upload from '@components/generic/upload/upload'
import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import VideoRecorder from '@components/generic/video-recorder/video-recorder-wrapper'

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
    publishing: {
      title: 'title',
    },
    comments: {
      enabled: true,
      permissions: [],
    },
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

  const dynamicFields = [
    {
      type: 'img',
      name: 'img',
      label: 'Image field',
    },
    {
      type: 'text',
      required: true,
      min: 10,
      max: 100,
      name: 'text',
      label: 'Text field',
      errorMessage: 'Minimum length 10, maximum 100',
      placeholder: 'A placeholder',
    },
    {
      type: 'textarea',
      name: 'textarea',
      label: 'Textarea',
      placeholder: 'A placeholder',
    },
    {
      type: 'select',
      name: 'select-dynamic',
      label: 'A select',
      options: [
        {
          value: 'option',
          label: 'an option',
        },
        {
          value: 'option2',
          label: 'another option',
        },
        {
          value: 'option3',
          label: 'the last option',
        },
      ],
    },
    {
      type: 'radio',
      name: 'radio-dynamic',
      label: 'A radio',
      options: [
        {
          value: 'option',
          label: 'an option',
        },
        {
          value: 'option2',
          label: 'another option',
        },
        {
          value: 'option3',
          label: 'the last option',
        },
        {
          value: 'option4',
          label: 'the last option?',
        },
        {
          value: 'option5',
          label: 'maybe not',
        },
        {
          value: 'option6',
          label: 'not the last option',
        },
        {
          value: 'option7',
          label: 'almost the last option',
        },
        {
          value: 'option8',
          label: 'yes! the last option',
        },
      ],
    },
    {
      type: 'json',
      name: 'json',
      label: 'Json field',
      placeholder: 'A placeholder',
    },
    {
      type: 'boolean',
      name: 'toggle',
      label: 'Toggle field',
    },
    {
      type: 'tags',
      name: 'tags',
      label: 'Tags field',
    },
    {
      type: 'video_url',
      name: 'video',
      label: 'Video URL field',
    },
  ]

  const dynamicValues = [
    {
      field: {
        type: 'text',
        name: 'text',
        label: 'A field',
      },
      value: 'This is an example of data',
    },
    {
      field: {
        type: 'textarea',
        name: 'textarea',
        label: 'A textarea',
      },
      value: 'This is an example of data',
    },
    {
      field: {
        type: 'video_url',
        name: 'video_url',
        label: 'video',
      },
      value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  ]

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
              <a href="#user-profile-box">User Profile Box</a>
            </li>
            <li>
              <a href="#author-box">Author Box</a>
            </li>
            <li>
              <a href="#badge">Badge</a>
            </li>
            <li>
              <a href="#card">Card</a>
            </li>
            <li>
              <a href="#button">Button</a>
            </li>
            <li>
              <a href="#loading">Loading</a>
            </li>
            <li>
              <a href="#loading-placeholder">Loading Placeholder</a>
            </li>
            <li>
              <a href="#toggle">Toggle</a>
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
              <a href="#image">Image</a>
            </li>
            <li className="submenu">
              <a href="#form-elements">Form elements</a>
              <ul>
                <li>
                  <a href="#select">Select</a>
                </li>
                <li>
                  <a href="#input-radio">Input Radio</a>
                </li>
                <li>
                  <a href="#input-text">Input Text</a>
                </li>
                <li>
                  <a href="#textarea">Textarea</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#form-elements-dynamic">Form Elements Dynamic</a>
            </li>
            <li>
              <a href="#dynamic-field-view">Dynamic field view</a>
            </li>
            <li>
              <a href="#tagsinput">Tags Input</a>
            </li>
            <li>
              <a href="#tagsfield">Tags Field</a>
            </li>
            <li>
              <a href="#passwordstrength">Password strength</a>
            </li>
            <li>
              <a href="#table">Table</a>
            </li>
            <li>
              <a href="#videorecorder">Video Recorder</a>
            </li>
            <li>
              <a href="#upload">Upload</a>
            </li>
            <li>
              <a href="#map">Map</a>
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
                      <Link href="/profile/me">
                        <a title="Profile">Profile</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/components">
                        <a title="Components">Components</a>
                      </Link>
                    </li>
                    <li>
                      <span className="spacer"></span>
                    </li>
                    <li>
                      <h4>Content</h4>
                    </li>

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
    <li>
      <Link href="/">
        <a title="Home">Home</a>
      </Link>
    </li>
    <li>
      <Link href="/profile">
        <a title="profile">Profile</a>
      </Link>
    </li>
    <li>
      <Link href="/components">
        <a title="Components">Components</a>
      </Link>
    </li>
    <li><span className="spacer"></span></li>
    <li><h4>Content</h4></li>

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
                <Avatar src="/static/demo-images/edge-avatar.jpg" />
                <Avatar src="/static/demo-images/edge-avatar.jpg" width={60} />
                <Avatar src="/static/demo-images/edge-avatar.jpg" width={30} />
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

          <div id="user-profile-box" className="component">
            <h3>User Profile Box</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <UserProfileBox
                  user={{
                    username: 'demo-user',
                    profile: { bio: '', facebook: 'yes' },
                  }}
                />
              </div>
              <div className="item-wrapper">
                <UserProfileBox
                  user={{
                    username: 'demo-user',
                    profile: {
                      picture: 'https://loremflickr.com/240/240/food?random=3',
                      displayName: 'Jonh Doe',
                      bio: 'My bio is something special',
                      github: 'yes',
                      facebook: 'yes',
                      twitter: 'yes',
                    },
                  }}
                />
              </div>
              <div className="item-wrapper">
                <UserProfileBox user={null} />
              </div>
            </div>
            <pre>{`
<UserProfileBox user={{username: 'demo-user', profile: { bio: 'My bio is something special'}}} />
            `}</pre>
          </div>

          <div id="author-box" className="component">
            <h3>Author Box</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <AuthorBox
                  user={{
                    username: 'demo-user',
                    profile: {
                      picture: 'https://loremflickr.com/240/240/food?random=1',
                      displayName: 'Jonh doe',
                    },
                  }}
                />
              </div>
              <div className="item-wrapper">
                <AuthorBox user={{ username: 'demo-user' }} />
              </div>
              <div className="item-wrapper">
                <AuthorBox user={null} />
              </div>
            </div>
            <pre>{`
<AuthorBox user={{username: 'demo-user', profile: { bio: 'My bio is something special'}}} />
            `}</pre>
          </div>

          <div id="badge" className="component">
            <h3>Badge</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Badge>42</Badge>
                <Badge alt>42</Badge>
                <Badge secondary>42</Badge>
                <Badge success>42</Badge>
                <Badge warning>42</Badge>
                <Badge alert>42</Badge>
              </div>

              <div className="item-wrapper">
                <Badge featured>Featured</Badge>{' '}
                <Badge alt featured>
                  Featured
                </Badge>{' '}
                <Badge secondary featured>
                  Featured
                </Badge>{' '}
                <Badge success featured>
                  Featured
                </Badge>{' '}
                <Badge warning featured>
                  Featured
                </Badge>{' '}
                <Badge alert featured>
                  Featured
                </Badge>
              </div>
              <div className="item-wrapper">
                <Badge featured></Badge>
                <Badge featured alt></Badge>
                <Badge featured secondary></Badge>
                <Badge featured success></Badge>
                <Badge featured warning></Badge>
                <Badge featured alert></Badge>
              </div>
            </div>
            <pre>{`
<Badge>42</Badge> 
<Badge alt >42</Badge> 
<Badge secondary >42</Badge> 
<Badge success >42</Badge> 
<Badge warning >42</Badge> 
<Badge alert >42</Badge>
<Badge alert featured>42</Badge>

            `}</pre>
          </div>

          <div id="card" className="component">
            <h3>Card</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Card>
                  <Avatar />
                  <h3>This is a test card</h3>
                </Card>
              </div>
              <div className="item-wrapper">
                <Card alt>
                  <h3>This is a test card</h3>
                </Card>
              </div>
              <div className="item-wrapper">
                <Card secondary>
                  <h3>This is a test card</h3>
                </Card>
              </div>
              <div className="item-wrapper">
                <Card success>
                  <h3>This is a test card</h3>
                </Card>
              </div>
              <div className="item-wrapper">
                <Card warning>
                  <h3>This is a test card</h3>
                </Card>
              </div>
              <div className="item-wrapper">
                <Card alert>
                  <h3>This is a test card</h3>
                </Card>
              </div>
            </div>
            <pre>{`
<Card>Content</Card> 
<Card alt >Content</Card> 
<Card secondary >Content</Card> 
<Card success >Content</Card> 
<Card warning >Content</Card> 
<Card alert >Content</Card>
<Card alert featured>Content</Card>

            `}</pre>
          </div>

          <div id="button" className="component">
            <h3>Button</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Button aria-label="Normal button">Button example</Button>
              </div>

              <div className="item-wrapper">
                <Button aria-label="Normal button" success>
                  Button example
                </Button>
              </div>

              <div className="item-wrapper">
                <Button aria-label="Normal button" warning>
                  Button example
                </Button>
              </div>

              <div className="item-wrapper">
                <Button aria-label="Normal button" alert>
                  Button example
                </Button>
              </div>

              <div className="item-wrapper">
                <Button aria-label="Normal button" secondary>
                  Button example
                </Button>
              </div>

              <div className="item-wrapper">
                <Button big aria-label="Big button">
                  Button example
                </Button>
              </div>

              <div className="item-wrapper">
                <Button loading aria-label="Loading button"></Button>
              </div>

              <div className="item-wrapper">
                <Button loading secondary aria-label="Loading button"></Button>
                <Button loading success aria-label="Loading button"></Button>
                <Button loading warning aria-label="Loading button"></Button>
                <Button loading alert aria-label="Loading button"></Button>
              </div>

              <div className="item-wrapper">
                <Button alt aria-label="Alt button">
                  Button example
                </Button>
              </div>

              <div className="item-wrapper">
                <Button alt big aria-label="Alt big button">
                  Button example
                </Button>
              </div>

              <div className="item-wrapper">
                <Button alt loading aria-label="Alt loading button"></Button>
              </div>
            </div>
            <pre>{`
<Button />
            `}</pre>
          </div>

          <div id="loading" className="component">
            <h3>Loading</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Loading />
              </div>
            </div>
            <pre>{`
<Loading />
            `}</pre>
          </div>

          <div id="loading-placeholder" className="component">
            <h3>Loading Placeholder</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <LoadingPlaceholder />
              </div>
              <div className="item-wrapper">
                <LoadingPlaceholder />
              </div>
              <div className="item-wrapper">
                <LoadingPlaceholder
                  width={'100px'}
                  height={'100px'}
                  borderRadius={'100%'}
                />
              </div>
            </div>
            <pre>{`
<LoadingPlaceholder />
<LoadingPlaceholder width={'100px'} height={'100px'} borderRadius={'100%'} />
            `}</pre>
          </div>

          <div id="toggle" className="component">
            <h3>Toggle</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Toggle />
              </div>
            </div>
            <pre>{`
<Toggle />
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

          {/*<div id="select" className="component">
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
  prefix: <img style={{'max-width': '100%' }}
  src="https://i.picsum.photos/id/519/50/50.jpg" />
  }, {
  value: 'ipsum',
  prefix: <img style={{'max-width': '100%' }}
  src="https://i.picsum.photos/id/212/50/50.jpg" />
  }]}>
  <option value='lorem'>Lorem</option>
  <option value='ipsum'>Ipsum</option>
</Select>
            `}</pre>
          </div> */}

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

          <div id="image" className="component">
            <h3>Image</h3>
            <div className="component-demo">
              <p>
                A "gracefully" loading image. If multiple images are passed it
                will display a carousel.
              </p>
              <div className="item-wrapper">
                <Image
                  srcs={[
                    'https://loremflickr.com/240/240/food?random=1',
                    'https://loremflickr.com/240/240/food?random=2',
                    'https://loremflickr.com/240/240/food?random=3',
                  ]}
                />
              </div>

              <div className="item-wrapper">
                <Image
                  srcs={['https://loremflickr.com/240/240/cars?random=1']}
                />
              </div>

              <div
                className="item-wrapper"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Image
                  srcs={[
                    {
                      url: 'https://loremflickr.com/240/240/cars?random=2',
                      quote: 'An amazing picture',
                      alt: 'An amazing picture',
                    },
                  ]}
                  width={500}
                  height={500}
                />
              </div>

              <div className="item-wrapper">
                <Image
                  srcs={[
                    {
                      url: 'https://loremflickr.com/240/240/flower?random=1',
                      quote: 'An amazing flower',
                      alt: 'An amazing flower',
                    },
                    {
                      url: 'https://loremflickr.com/240/240/flower?random=2',
                      quote: 'Another flower',
                      alt: 'An amazing flower',
                    },
                  ]}
                />
              </div>
            </div>
            <pre>{`
 <Image srcs={['https://loremflickr.com/240/240/cars?random=1']} />

 <Image srcs={[{
  url: 'https://loremflickr.com/240/240/cars?random=2',
  quote: 'An amazing picture'
  }]} />
            `}</pre>
          </div>

          <div id="form-elements" className="component">
            <h3>Form Elements (CSS)</h3>
            <div className="component-demo">
              <div className="item-wrapper" id="select">
                <div className="input-group">
                  <label for="demo-select">Select example</label>
                  <div className="input-select">
                    <select id="demo-select">
                      <option>Select example</option>
                      <option>Select example 2</option>
                      <option>Select example 3</option>
                      <option>Select example 4</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="item-wrapper" id="input-radio">
                <div className="input-group">
                  <label for="demo-radio">Radio example</label>
                  <div className="input-radio-group">
                    <div className="input-radio">
                      <input
                        type="radio"
                        id="demo-radio1"
                        name="demo-radio-group"
                      ></input>
                      <label for="demo-radio1">Always</label>
                    </div>
                    <div className="input-radio">
                      <input
                        type="radio"
                        id="demo-radio2"
                        name="demo-radio-group"
                      ></input>
                      <label for="demo-radio2">Sometimes</label>
                    </div>
                    <div className="input-radio">
                      <input
                        type="radio"
                        id="demo-radio3"
                        name="demo-radio-group"
                      ></input>
                      <label for="demo-radio3">Never</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="item-wrapper" id="input-text">
                <div className="input-group required">
                  <label for="demo-input-text">Input text example</label>
                  <input
                    type="text"
                    id="demo-input-text"
                    placeholder="Input text example"
                  ></input>
                </div>
              </div>

              <div className="item-wrapper">
                <div className="input-group required">
                  <input
                    type="text"
                    id="demo-input-text"
                    placeholder="Input text (no label) example"
                  ></input>
                </div>
              </div>

              <div className="item-wrapper" id="textarea">
                <div className="input-group">
                  <label for="demo-textarea">Textarea example</label>
                  <textarea
                    id="demo-textarea"
                    placeholder="Textarea example"
                  ></textarea>
                </div>
              </div>

              <div className="item-wrapper">
                <div className="input-group error">
                  <label for="demo-input-text-error">Input text example</label>
                  <input
                    type="text"
                    id="demo-input-text-error"
                    placeholder="Input text example"
                  ></input>
                  <span className="error-message">
                    This is an error message
                  </span>
                </div>
              </div>
            </div>
            <pre>{`
<select><option>Example</option></select>

<input type="text" placeholder="Example input"></input>

<textarea placeholder="Example textarea"></textarea>

            `}</pre>
          </div>

          <div id="form-elements-dynamic" className="component">
            <h3>Form Elements Dynamic</h3>
            <p>
              See the documentation for more information about dynamic fields
            </p>
            <div className="component-demo">
              <div className="item-wrapper">
                <div>
                  {dynamicFields.map((f) => {
                    return (
                      <DynamicField
                        field={f}
                        value={null}
                        onChange={() => {}}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
            <pre>{`
{dynamicFields.map(f => {
  return <DynamicField field={f} value={null} onChange={() => {}} />
})}
            `}</pre>
          </div>

          <div id="dynamic-field-view" className="component">
            <h3>Dynamic field view</h3>
            <p>A field for wrapping the representation of dynamic data</p>
            <div className="component-demo">
              <div className="item-wrapper">
                <div>
                  {dynamicValues.map((item) => {
                    return (
                      <DynamicFieldView
                        field={item.field}
                        value={item.value}
                        contentType={{ slug: 'test' }}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
            <pre>{`
{dynamicValues.map(item => {
  return (
    <DynamicFieldView field={item.field} value={item.value} contentType={{slug: 'test'}} />
  )
})}
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
                  value={[
                    { label: 'Software', slug: 'software' },
                    { label: 'Web dev', slug: 'web-dev' },
                  ]}
                  placeholder="Your tags"
                />
              </div>
            </div>
            <pre>{`
<TagsInput onChange={} placeholder="Your tags" value={[{label: 'Something', slug: 'another'}]}/>
  `}</pre>
          </div>

          <div id="tagsfield" className="component">
            <h3>Tags Field</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <TagsField
                  tags={[
                    { label: 'test', slug: 'test' },
                    { label: 'demo', slug: 'demo' },
                  ]}
                  contentType={{ slug: 'post' }}
                />
              </div>
            </div>
            <pre>{`
<TagsField tags={[{label: 'test', slug: 'test'}, {label: 'demo', slug: 'demo'}]} contentType={{slug : 'post'}} />
  `}</pre>
          </div>

          <div id="passwordstrength" className="component">
            <h3>Password Strength</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <PasswordStrength password="he" />
              </div>
              <div className="item-wrapper">
                <PasswordStrength password="hesS" />
              </div>
              <div className="item-wrapper">
                <PasswordStrength password="hesS1" />
              </div>
              <div className="item-wrapper">
                <PasswordStrength password="h!SS1" />
              </div>
              <div className="item-wrapper">
                <PasswordStrength password="he!sS.S1asd" />
              </div>
            </div>
            <pre>{`
<PasswordStrength password='he!sS.S1asd'  />
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
                        src="/static/demo-images/edge-avatar.jpg"
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
                        src="/static/demo-images/edge-avatar.jpg"
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
                        src="/static/demo-images/edge-avatar.jpg"
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
                        src="/static/demo-images/edge-avatar.jpg"
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
                        src="/static/demo-images/edge-avatar.jpg"
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
              </div>
            </div>
            <pre>{`
<Table
  //Header Sections
  headerCells={[
    <TableCellHeader>User</TableCellHeader>,
    <TableCellHeader>Email</TableCellHeader>,
    <TableCellHeader>Last Activity</TableCellHeader>,
    <TableCellHeader>Actions</TableCellHeader>,
  ]}
  >
  //Body Content Unit
  <TableRowBody>
    <TableCellBody>
      <Avatar/> User Name
    </TableCellBody>
    <TableCellBody>
      user@user.com
    </TableCellBody>
    <TableCellBody>
      Today
    </TableCellBody>
    <TableCellBody>
      <Button>Delete</Button>
    </TableCellBody>
  </TableRowBody>
</Table>
  `}</pre>
          </div>

          <div id="videorecorder" className="component">
            <h3>Video Recorder</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <VideoRecorder />
              </div>
            </div>
            <pre>{`
<VideoRecorder />
  `}</pre>
          </div>

          <div id="upload" className="component">
            <h3>upload</h3>
            <div className="component-demo">
              <div className="item-wrapper">
                <Upload />
              </div>
            </div>
            <pre>{`
<Upload />
  `}</pre>
          </div>

          <div id="map" className="component">
            <h3>Map</h3>
            <div className="component-demo">
              <div className="item-wrapper" style={{ height: '400px' }}>
                <Map />
              </div>
            </div>
            <pre>{`
<Map />
  `}</pre>
          </div>
        </div>
      </div>
      <style jsx>{`
        h1 {
          padding-left: var(--empz-gap-double);
          margin-bottom: var(--empz-gap);
        }
        .components-layout {
          align-items: flex-start;
          display: flex;
          flex-wrap: wrap;
        }

        .components-layout h3{
          font-size: 24px;
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
          max-width: 420px;
          width: 30%;
          z-index: var(--z-index-header);
        }

        .list-menu::-webkit-scrollbar {
          width: 10px;
        }

        .list-menu::-webkit-scrollbar-thumb {
          background: var(--accents-3);
        }

        .list-menu::-webkit-scrollbar-track {
          background: var(--accents-1);
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
          display-flex;
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
        
        #form-elements .component-demo{
          margin: 40px 0;
          max-width: 520px;
        }

        #form-elements .item-wrapper{
          margin: 0;
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
