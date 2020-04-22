# Empieza - Next Admin Kit


## Features

- Dynamic Admin dashboard
  - Administration of users
  - Administration of content
  - Administration of comments
- Dynamic API
  - REST API for content, users, comments, users-activity
- Static Content Generation
  - Write Markdown and get static HTML generated pages for high performance
- Themes (Dark, Light, Robot)
  - Multi Theme support, cookie based
- Login with [Passport.js](http://www.passportjs.org)
- ~Multilingual support with [next-i18next](https://github.com/isaachinman/next-i18next) or [next-translate](https://github.com/vinissimus/next-translate)~ See [this issue](https://github.com/isaachinman/next-i18next/issues/274)
- Integrated with Firebase and MongoAtlas
 
## Static Pages

SSG (Static Site Generation) Feature is implemented. In the folder `static-pages` you can find the different static pages the application uses. Pages like **About**, **Privacy Policy**, etc.


## Content Types
Content types may be defined in `empieza.config.js`. You can create as many content types with different definitions and permissions. The API will validate the access to the endpoints based on the permissions you defined.

You can see [the example config file](/empieza.config.js) for more details.

## API

The Content API is defined on your set of rules in the configuration file, the other APIs are standard.

### Users
- `GET /api/users`
  - Access limited to users with permission `user.list` or `user.admin`
- `GET /api/users/ID`
  - Access limited to own user or users with permission `user.read` or `user.admin`
- `POST /api/users`
  - Access limited to `user.admin`
- `PUT /api/users/ID`
  - Access limited to own user or users with permission `user.admin` and `user.write`
- `DELETE /api/users/ID`
  - Access limited to own user or users with permission `user.admin` and `user.delete`

### Content
- `GET /api/content/[TYPE]`
  - Access limited to users with permission `content.TYPE.read` or `content.TYPE.admin`
- `GET /api/content/[TYPE]/[CONTENT_SLUG]` | `GET /api/content/[TYPE]/[CONTENT_ID]?field=id`
  - Access limited to own user or users with permission `content.TYPE.read` or `content.TYPE.admin`
- `POST /api/content/[TYPE]`
  - Access limited to `content.TYPE.admin`, or `content.TYPE.write`
- `PUT /api/content/[TYPE]/[CONTENT_SLUG]` | `POST /api/content/[TYPE]/[CONTENT_SLUG]` |  `PUT /api/content/[TYPE]/[CONTENT_ID]?field=id` |  `POST /api/content/[TYPE]/[CONTENT_ID]?field=id`
  - Access limited to own user or users with permission `content.TYPE.admin` or `content.TYPE.write`
- `DELETE /api/content/[TYPE]/[CONTENT_SLUG]` | `GET /api/content/[TYPE]/[CONTENT_ID]?field=id`
  - Access limited to own user or users with permission `content.TYPE.admin` or `content.TYPE.delete`

### Comments

- `GET /api/comments/[TYPE]/[CONTENT_ID]`
  - Access limited to users with permission `content.TYPE.comments.read` or `content.TYPE.comments.admin`
- `GET /api/comments/[TYPE]/[CONTENT_ID]/[COMMENT_ID]`
  - Access limited to own user or users with permission `content.TYPE.comments.read` or `content.TYPE.comments.admin`
- `POST /api/comments/[TYPE]/[CONTENT_ID]`
  - Access limited to `content.TYPE.comments.admin`, or `content.TYPE.comments.write`
- `PUT /api/comments/[TYPE]/[CONTENT_ID]/[COMMENT_ID]`
  - Access limited to own user or users with permission `content.TYPE.comments.admin` or `content.TYPE.comments.write`
- `DELETE /api/comments/[TYPE]/[CONTENT_ID]/[COMMENT_ID]` 
  - Access limited to own user or users with permission `content.TYPE.comments.admin` or `content.TYPE.comments.delete`


## Databases
Different databases can be configured, Firebase (Firestore), MongoDB and "In Memory"

### In memory DB (only local)

There is a "In memory" database for development and testing purposes. It allows you to work with Mock data easily.

Set the following config (default)

```javascript
database: {
  type: 'IN_MEMORY'
}
```

### Firebase 

If you want to use Firebase you must set the following environment variables in the `.env` file:

````
FIREBASE_PROJECT_ID=XX
FIREBASE_CLIENT_EMAIL=XX
FIREBASE_DATABASE_URL=XX
FIREBASE_PRIVATE_KEY=XX
````

See the [example .env.build file](/.env.build)

Also in the config you must set the following values:

````javascript
database: {
  type: 'FIREBASE'
}
````

If you want your deployment in Zeit to recognize the `.env` values, you will need to add the secrets:

```
$ now secrets add firebase-api-key ■■■■■■■■-■■■■■■■■

$ now secrets add firebase-auth-domain ■■■■■■■■.firebaseapp.com

$ now secrets add firebase-database-url https://■■■■■■■■.firebaseio.com

$ now secrets add firebase-project-id ■■■■■■■■

$ now secrets add firebase-storage-bucket ■■■■■■■■.appspot.com

$ now secrets add firebase-messaging-sender-id ■■■■■■■■

$ now secrets add firebase-app-id 1:■■■■■■■■:web:■■■■■■■■

$ now secrets add firebase-measurement-id G-■■■■■■■■

$ now secrets add firebase-client-email firebase-adminsdk-■■■■@■■■■■■■■.iam.gserviceaccount.com

$ now secrets add -- firebase-private-key "-----BEGIN PRIVATE KEY-----\n■■■■■■■■\n-----END PRIVATE KEY-----\n"
```

See [this post](https://dev.to/benzguo/getting-started-with-next-js-now-firebase-4ejg) for more information

## Passport

This example show how to use [Passport.js](http://www.passportjs.org) with Next.js. The example features cookie based authentication with username and password.

The example shows how to do a login, signup and logout; and to get the user info using a hook with [SWR](https://swr.now.sh).

A DB is not included. You can use any db you want and add it [here](/lib/user.js).

The login cookie is httpOnly, meaning it can only be accessed by the API, and it's encrypted using [@hapi/iron](https://hapi.dev/family/iron) for more security.

## Deploy your own

Deploy the example using [ZEIT Now](https://zeit.co/now):

[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/new/project?template=https://github.com/zeit/next.js/tree/canary/examples/with-passport)

## How to use

### Using `create-next-app`

Execute [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npm init next-app --example with-passport with-passport-app
# or
yarn create next-app --example with-passport with-passport-app
```

### Download manually

Download the example [or clone the repo](https://github.com/zeit/next.js):

```bash
curl https://codeload.github.com/zeit/next.js/tar.gz/canary | tar -xz --strip=2 next.js-canary/examples/with-passport
cd with-passport
```

Install it and run:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

Deploy it to the cloud with [ZEIT Now](https://zeit.co/import?filter=next.js&utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).


## i18n

Internationalization can be done using `react-intl` and getInitialProps in the server side, for loading only the correct language.

https://github.com/PaulPCIO/nextjs-with-react-intl


## TODO List
- Sitemap xml
- Content detail, get stataic props, better loading
- Pagination:
  - Ensure limit and from are numbers
- Profile: 
  - Add recent activity section
- i18n
  - Choose a good i18n libray
- Redux
  - Study if we will add redux for the dashboard 
    - https://github.com/willianantunes/nextjs-playground
    - https://github.com/kirill-konshin/next-redux-wrapper
- Test
  - Test config loading and initialization
  - Test config validation
  - Add coverage with codeclimate
- Load config
  - Add the correct schema validation
- Connect to a database
  - Firebase
  - MongoDB
  - In Memory DB
- Comments
  - Add integration tests and complete functionality
  - https://docs.mongodb.com/drivers/use-cases/storing-comments
- Content CRUD
  - [] Document and finish permissions on content api
  - Add validations on client side and server side
  - Allow to upload files
  - Link author
- Demo
  - Client side content routing: Add SEO optimizations
- User CRUD
  - Allow Google / Facebook signup (?)
- Startup script
  - Preseed database 
- Dockerfile
  - See how to complete a good example