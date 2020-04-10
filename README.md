# Empieza - Next Admin Kit

## Features

- Dynamic Admin dashboard
- Dynamic API
- Demo home page
- Login with [Passport.js](http://www.passportjs.org)
- ~Multilingual support with [next-i18next](https://github.com/isaachinman/next-i18next) or [next-translate](https://github.com/vinissimus/next-translate)~ See [this issue](https://github.com/isaachinman/next-i18next/issues/274)
- Integrated with Firebase and MongoAtlas


## Databases


### In memory DB (only local)

There is a In memory DB for development

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
- Load config
  - Add the correct schema validation
- Connect to a database
  - Firebase
  - MongoDB
  - In Memory DB
- Content CRUD
  - Add validations on client side and server side
  - Allow to upload files
  - Link author
- Demo
  - Client side content routing: Add SEO optimizations
- User CRUD
  - Allow Google / Facebook signup (?)
- Startup script
  - Preseed database 