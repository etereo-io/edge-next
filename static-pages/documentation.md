---
title: Documentation
description: "Empieza Documentation"
---

# Documentation

- [Documentation](#documentation)
  - [Features](#features)
  - [How to start using Edge.](#how-to-start-using-edge)
  - [edge.config.js](#edgeconfigjs)
  - [Adding a new theme](#adding-a-new-theme)
  - [Content Types](#content-types)
  - [Fields](#fields)
    - [Options for each field type](#options-for-each-field-type)
  - [Storage](#storage)
    - [Google](#google)
  - [Databases](#databases)
    - [Database API](#database-api)
      - [Adding items](#adding-items)
      - [Finding items](#finding-items)
      - [Updating an item](#updating-an-item)
      - [Deleting an item](#deleting-an-item)
    - [In memory DB (only local)](#in-memory-db-only-local)
    - [MongoDB](#mongodb)
    - [Firebase](#firebase)
  - [Authentication](#authentication)
    - [Providers](#providers)
  - [Emails](#emails)
  - [Static Pages](#static-pages)
  - [````markdown](#predivdivpre)
  - [description: "Example page description"](#description-example-page-description)
- [THIS IS A TITLE](#this-is-a-title)
  - [Web monetization](#web-monetization)
  - [Other Payments](#other-payments)
- [env.local file](#envlocal-file)
  - [Deploy your own](#deploy-your-own)
    - [Deploying on Vercel](#deploying-on-vercel)
  - [API](#api)
    - [Auth](#auth)
    - [Users](#users)
    - [Content](#content)
    - [Comments](#comments)
    - [Activity](#activity)



## Features

- Dynamic content types
  - Easily configurable
  - Dynamic forms
  - Permissions limited by roles
- Dynamic Admin dashboard
  - Administration of users
  - Administration of content
  - Administration of comments
- Dynamic API
  - Automatic API:
    - content
    - users
    - comments
    - user activity
- Web monetization
- Social Providers
  - Integration with different social providers for authentication
- Static Content Generation
  - Write Markdown and get static HTML generated pages for high performance
- Multiple UI Themes (Dark, Light, Robot, Kawai)
  - Multi Theme support, cookie based
- Login with [Passport.js](http://www.passportjs.org)
- Emails and email templates
  - Verify email and notify email implementations
- Multiple components
  - Checkout [the components page](/components)
- PWA
  - Provided by [next-pwa](https://github.com/shadowwalker/next-pwa)
- Easy to deploy
  - Deploy on platforms like Vercel in minutes
- ~Multilingual support~


## How to start using Edge.

1) Clone the [repo](https://github.com/nucleo-org/edge-next)
2) Edit `edge.config.js` to define your *Content Types* and permissions
3) Create the different accounts:
   - Google storage
   - Social provider apps for sign-in/sign-up (github, facebook, google)
   - Mongo db database
4) Configure the environment variables in the `.env.local` file.
5) Run with `yarn dev` or `npm run dev`
 

## edge.config.js

All the configuration of Edge is done in this file on the root of the folder. 

Here users can define content types, permissions and much more. 

Example config file [here](/p/configuration-file)


## Adding a new theme

To add a new theme, create the styles in the file `_app.js`, you can copy any other style defined there as a template.

Theme variables are defined in the following way: 

```css
.robot-theme {
  --edge-foreground: #33cf33;
  --edge-background: #000;
  --edge-selection: var(--edge-purple);
  --accents-1: #082008;
  --accents-2: #0d360d;
  --accents-3: #124712;
  --accents-4: #165816;
  --accents-5: #1c721c;
  --accents-6: #1f7a1f;
  --accents-7: #269726;
  --accents-8: #2cbe2c;
  --edge-success-light: #3291ff;
  --edge-success: #0070f3;
  --edge-success-dark: #0366d6;
  --edge-error-light: #f33;
  --edge-error: red;
```

Then edit the `edge.config.js` file and add your new theme

```javascript
// Themes
    theme: {
      default: 'light-theme',
      themes: [
        {
          label: 'Light',
          value: 'light-theme',
          mainColor: 'white',
          borderColor: 'black',
        },
        {
          label: 'Dark',
          value: 'dark-theme',
          mainColor: 'black',
          borderColor: 'white',
        },
        {
          label: 'Robot',
          value: 'robot-theme',
          mainColor: 'black',
          borderColor: 'green',
        },
        {
          label: 'Kawaii',
          value: 'kawaii-theme',
          mainColor: 'pink',
          borderColor: 'black',
        },
      ],
    },
  ```

## Content Types
Content types may be defined in `empieza.config.js`. You can create as many content types with different definitions and permissions. The API will validate the access to the endpoints based on the permissions you defined.

Content types take the following structure:

```javascript
const contentType = {
  // The name for this content type
  title: 'Blog Posts',

  // The URL for the API and client routes
  slug: 'blog-posts',

  // How slugs are going to be generated for new content. 
  // For example "a-new-blog-post-123132132"
  slugGeneration: ['title', 'createdAt'],

  // Sets of permissions for the API and client sides
  permissions: {
    // Who can read the content
    read: ['PUBLIC'],

    // Who can create content
    create: ['ADMIN', 'USER'],

    // Who can edit ANY content
    update: ['ADMIN'],

    // Who can delete ANY content
    delete: ['ADMIN'],

    // Who can perform all of the above
    admin: ['ADMIN']
  },

  // Publishing and SEO settings
  publishing: {

    // Allow content owners to mark the content as draft and avoid visibility
    draftMode: true,

    // Which field will be used for SEO and linking
    title: 'title'
  },

  monetization: {
    web: true // Enable web monetization for a content type
  },

  // View type display on the users profile and content pages (grid or list)
  display: 'grid',

  comments: {
    // Enable or disable comments
    enabled: true,

    permissions: {
      // Who can read the comments
      read: ['PUBLIC'],

      // Who can create comments
      create: ['ADMIN', 'USER'],

      // Who can edit ANY comments
      update: ['ADMIN'],

      // Who can delete ANY comments
      delete: ['ADMIN'],

      // Who can perform all of the above
      admin: ['ADMIN']
    },
  },


  // A list of fields, see below for more information
  fields: [{
    // Required values
    name: 'title',
    type: 'text',
    label: 'Post title',

    // Optional values
    placeholder: 'Type your title',
    minlength: 10,
    maxlength: 200,
    required: true,
    pattern="[A-Za-z]{3}"
  }]
}
```


## Fields

Form fields are automaticaly generated based on the content type, or user profile configuration. 

There are different fields that can be configured with some standard attributes and some non-standard.

**All fields include shared otions**:
- label (field label)
- name (field name)
- type ('text', 'number', 'radio'...)
- required
- errorMessage: String, error message displayed when validation fails
- hidden
- description
- showLabel: shows the field label on the content view, default false

Example: 

```javascript
const contentType = {
  fields: [{
    label: 'My field',
    type: 'text',
    required: true,
    name: 'myfield',
    description: 'This is some information to help the user fill the field',
    hidden: false, // Hide the field from display
    errorMessage: 'The error message that is going to be displayed'
  }]
}
```

### Options for each field type

- text 
  - Available options:
    - minlength
    - maxlength
    - required
    - pattern
    - placeholder
    - defaultValue
- number
  - Available options:
    - min
    - max
    - required
    - placeholder
    - defaultValue
- select
  - Available options:
    - required
    - defaultValue
    - options
      - ```[{label: 'a', value: 'a'}] ```
- boolean (displayed as a toggle)
  - Available options:
    - defaultValue
- textarea
  - Available options:
    - required
    - minlength
    - maxlength
    - defaultValue
- markdown
  - Available options:
    - required
    - minlength
    - maxlength
    - defaultValue
- tel
  - Available options:
    - required
    - pattern
    - defaultValue
- date
  - Available options:
    - required
    - max
    - min
    - defaultValue
- url
  - Available options:
    - required
    - minlength
    - maxlength
    - pattern
    - defaultValue
- video_url
  - Available options:
    - required
    - minlength
    - maxlength
    - defaultValue
- tags
  - Available options:
    - required
    - defaultValue
    - options *
- img (image)
  - Available options:
    - required
    - multiple (boolean)
    - accept (defaults to='jpg,png,jpeg,webp,.gif')
- file
  - Available options:
    - required
    - multiple (boolean)
    - accept
    - capture
- radio
  - Available options:
    - required
    - options
      - ```[{label: 'a', value: 'a'}] ```
    - defaultValue
 


You can see the example configuration file for more details about content types and fields.

In the [components page](/components) you will find more implemented dynamic fields.

## Storage

To upload images and other files you will need to configure a storage. 

Different options are: AWS, GOOGLE or FIREBASE.

### Google

To configure Google storage you will need to follow the steps defined in this [package](https://www.npmjs.com/package/@google-cloud/storage). You will need to create a service account and a bucket with public visibility.

The environment variables you need to configure are :

````
GOOGLE_CLIENT_EMAIL=XX
GOOGLE_PRIVATE_KEY=XX
GOOGLE_PROJECTID=XX
GOOGLE_BUCKET_NAME=XX
````

You can obtain the GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY and GOOGLE_PROJECTID variables from a service account that you must export from the Google cloud dashboard. 

Another useful resources:
- [Create a Google cloud bucket](https://cloud.google.com/storage/docs/creating-buckets) 
- [Making files public in google bucket](https://cloud.google.com/storage/docs/access-control/making-data-public)
- [Another way to import Google Application Credentials](https://dev.to/parondeau/gcp-credentials-next-js-3a0d)


## Databases
Different databases can be configured, Firebase (Firestore), MongoDB and "In Memory"

**Note: The only production ready database is MongoDB**, Firebase integration is not complete.

### Database API

All the Databases use the same API abstraction

#### Adding items

```javascript
db.collection('collection')
  .add(item)
```

#### Finding items

```javascript
db.collection('collection')
  .find({name: 'test'})
```

```javascript
db.collection('collection')
  .findOne({name: 'test'})
```

#### Updating an item

```javascript
db.collection('collection')
  .doc('ID')
  .set({name: 'test'})
```

#### Deleting an item

```javascript
db.collection('collection')
  .doc('ID')
  .delete()
```


### In memory DB (only local)

There is a "In memory" database for development and testing purposes. It allows you to work with Mock data easily.

Set the following config (default)

```javascript
database: {
  type: 'IN_MEMORY'
}
```

### MongoDB

To configure mongodb you will need to set the configuration:

```javascript
database: {
  type: 'MONGO'
}
```

The environment variables you need to configure are documented in the Deployments section of the documentation.

```
MONGODB_URI=MONGODB_URI=mongodb+srv://<username>:<password>@<url>
MONGODB_DATABASE=<database>
```

### Firebase 

**Note: Firebase is not totally implemented**

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

## Authentication 

Empieza uses [Passport.js](http://www.passportjs.org) cookie based authentication with email and password.

The login cookie is httpOnly, meaning it can only be accessed by the API, and it's encrypted using [@hapi/iron](https://hapi.dev/family/iron) for more security.

### Providers

In the configuration different providers can be enabled or disabled

```javascript
const config = {
  user: {
    providers: {
      facebook: true,
      google: true,
      github: false
    }
  }
}

```

By changing this configuration, both the login and the register will change to show or hide the corresponding buttons.

To configure the different API keys for each provider you must edit the environment files.

- [Register your Github application](https://github.com/settings/applications/new)
- [Register your Google application](https://developers.google.com/identity/sign-in/web/sign-in)
- [Register your Facebook application](https://developers.facebook.com/)

After creating your applications you will need to define the following environment variables in your `.env.local` file.

````
FACEBOOK_ID=XX
FACEBOOK_SECRET=XX
GITHUB_ID=XX
GITHUB_SECRET=XX
GOOGLE_ID=XX
GOOGLE_SECRET=XX
````

In the Oauth callbacks fill in the following API urls:

```
YOURSITE.COM/api/auth/github/callback
YOURSITE.COM/api/auth/facebook/callback
YOURSITE.COM/api/auth/google/callback
```

You don't need to configure any or all of the authentication providers. You can disable them on the `edge.config.js` file.


## Emails

Empieza uses [Sendgrid](https://sendgrid.com/) to send emails. Although this is easily editable; just edit `/lib/email/sender.js` to change the sending implementations.

There are some email templates included and working:

- Call to Action template: A simple template with a button. Used to verify user emails.

Some resources:

- [Get a sendgrid API key](https://www.youtube.com/watch?v=ShOQxpX7Dcw)

Once you have your sendgrid API key you will need to include it on the environment file:

````
SENDGRID_KEY=XX
````

## Static Pages

SSG (Static Site Generation) is implemented. 
In the folder `static-pages` you can find the different markdown pages that are prerendered for fast loading.
The pages include common use cases like **About**, **Privacy Policy**, **Terms and conditions**.

````markdown
---
title: Example page
description: "Example page description"
---

# THIS IS A TITLE

Hello, this is a static page, automatically rendered.

````

## Web monetization

Web monetization is integrated into Edge and is easily enabled via configuration.

To enable web monetization, first, enable web monetization on a content type. Set the following configuration on a content type.

```javascript
  monetization: {
    web: true // Enable web monetization for a content type
  },
```

Also you will need to add a field named `paymentPointer` into the fields list of that content type.

Follow the example below:

```javascript

fields: [  {
    name: 'paymentPointer',
    type: 'text',
    label: 'Payment Pointer',
    placeholder: 'Web monetization payment pointer',
    hidden: true,
    description: 'Add your web monetization payment pointer to make this content private, and only accesible by web monetization'
  }, {
  /* Additional fields here */
}]

```

When the user, introduces a [payment pointer](https://webmonetization.org/docs/getting-started) in the content, the content becomes private and only accesible via web monetization payments, destined to the user payment pointer.

## Other Payments

We have configured a HOC (higher order component) to integrate [stripe js](https://stripe.com/docs/stripe-js/react).

But Edge has NO built-in payment process, because there are multiple use cases that should be covered. 

If you want to use Stripe, first you need to create an [Stripe account](https://dashboard.stripe.com/login?redirect=%2Faccount%2Fapikeys) and configure the public API key in the environment variables

````bash
# env.local file
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=XXXXXXXXXXXXXX
````

After that you will need to code your own payment process. 

There are differente integrations:

- Client side only payments
- Client + Server side payments

Depending on what you want to seel (if you want the users to be able to sell, or only the site owners) you will need to create different flows.


[Stripe DOCS](https://stripe.com/docs/)
[Getting Charges](https://stripe.com/docs/connect/charges)

## Deploy your own

To deploy your site with all the functionalities you need to configure the different environment variables.

All the environment variables are defined inside the `.env.build` example file

```
AUTH_TOKEN_SECRET=secret-token-to-generate-sessions

BASE_URL=http://localhost:3000

MONGODB_URI=MONGODB_URI=mongodb+srv://<username>:<password>@<url>
MONGODB_DATABASE=<database>

SENDGRID_KEY=XXX

GOOGLE_CLIENT_EMAIL=XX
GOOGLE_PRIVATE_KEY=XX
GOOGLE_PROJECTID=XX
GOOGLE_BUCKET_NAME=edge-next

FACEBOOK_ID=XX
FACEBOOK_SECRET=XX
GITHUB_ID=XX
GITHUB_SECRET=XX
GOOGLE_ID=XX
GOOGLE_SECRET=XX

NEXT_PUBLIC_GMAPS_API_KEY=XXXX

NEXT_PUBLIC_GA_TRACKING_ID=xx
```

- **Base url**: Used to redirect oauth enpoints. Set `BASE_URL` to the url of your deployment
- **Google Analytics**: Set `NEXT_PUBLIC_GA_TRACKING_ID` to the Tracking Id from Google Analytics
- **Social Providers**: Set `FACEBOOK_ID`, `FACEBOOK_SECRET`, `GOOGLE_ID`, `GOOGLE_SECRET`, and `GITHUB_ID`, `GITHUB_SECRET`
- **Storage**: For google cloud storage configure `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_PROJECTID` and `GOOGLE_BUCKET_NAME` from your credentials file.
- **Email**: Configure `SENDGRID_KEY`
- **Google Maps**: Configure `NEXT_PUBLIC_GMAPS_API_KEY`

### Deploying on Vercel

Deploy Empieza using [Vercel](https://vercel.com):


If you want your deployment in Vercel to recognize the `ENVIRONMENT` values, you will need to add the secrets to your deployment. 

You can add them through the command line or through the administration dashboard in Vercel.com

![](/static/docs/env-variables-vercel-2.png)


## API

The Content API is defined on your set of rules in the configuration file, the other APIs are standard.

### Auth
- `POST /api/auth/login`
  - `{ email: xxx@xxx.com, password: password}`
  - Logs in a user
- `GET /api/auth/logout`
  - Logout a user
- `GET /api/auth/reset-password?email=xxx@xxx.com`
  - Marks the user for reset password, sends an email with a token
- `POST /api/auth/reset-password`
  - `{email: xxx@xxx.com, password: NewPassword, token: token }`
  - Enables de new password for a user
- `GET /api/auth/verify?email=xxx@xxx.com&token=TOKEN`
  - Verifies a user email

### Users
- `GET /api/users`
  - Access limited to users with permission `user.list` or `user.admin`
- `GET /api/users/ID` | `GET /api/users/me` | `GET /api/users/@username`
  - Access limited to own user or users with permission `user.read` or `user.admin` (or own user)
- `POST /api/users`
  - Access limited to users with permission `user.create`. Default is public, to allow users to register.
- `PUT /api/users/ID`
  - Access limited to own user or users with permission `user.admin` and `user.update`
  - To update a user the different endpoint sufixes have to be added
  - `PUT /api/users/ID/profile`
    - Edit the fields of the profile such as displayName or dynamic fields
    - `{ displayName: 'Jonh Doe'}`
  - `PUT /api/users/ID/email`
    - Change email
    - `{ email: 'johndoe@gmail.com'}`
  - `PUT /api/users/ID/username`
    - Change username
    - `{ username: 'mrdoe'}`
  - `PUT /api/users/ID/picture`
    - Change profile picture
    - request profilePicture should be a binary file
  - `PUT /api/users/ID/password`
    - Updates user password
    - `{ password: currentPassword, newPassword: newPassword }`
  - `PUT /api/users/ID/block`
    - Blocks / Unblocks an user
    - `{ blocked: true }`
- `DELETE /api/users/ID`
  - Access limited to own user or users with permission `user.admin` and `user.delete`. For the current user is also required to send a `password` query parameter.

### Content
- `GET /api/content/[TYPE]`
  - Access limited to users with permission `content.TYPE.read` or `content.TYPE.admin`
- `GET /api/content/[TYPE]/[CONTENT_SLUG]` | `GET /api/content/[TYPE]/[CONTENT_ID]?field=id`
  - Access limited to own user or users with permission `content.TYPE.read` or `content.TYPE.admin`
- `POST /api/content/[TYPE]`
  - Access limited to `content.TYPE.admin`, or `content.TYPE.create`
- `PUT /api/content/[TYPE]/[CONTENT_SLUG]` | `POST /api/content/[TYPE]/[CONTENT_SLUG]` |  `PUT /api/content/[TYPE]/[CONTENT_ID]?field=id` |  `POST /api/content/[TYPE]/[CONTENT_ID]?field=id`
  - Access limited to own user or users with permission `content.TYPE.admin` or `content.TYPE.update`
- `DELETE /api/content/[TYPE]/[CONTENT_SLUG]` | `GET /api/content/[TYPE]/[CONTENT_ID]?field=id`
  - Access limited to own user or users with permission `content.TYPE.admin` or `content.TYPE.delete`

### Comments

- `GET /api/comments/[TYPE]/[CONTENT_ID]`
  - Access limited to users with permission `content.TYPE.comments.read` or `content.TYPE.comments.admin`
- `GET /api/comments/[TYPE]/[CONTENT_ID]/[COMMENT_ID]`
  - Access limited to own user or users with permission `content.TYPE.comments.read` or `content.TYPE.comments.admin`
- `POST /api/comments/[TYPE]/[CONTENT_ID]`
  - Access limited to `content.TYPE.comments.admin`, or `content.TYPE.comments.create`
- `PUT /api/comments/[TYPE]/[CONTENT_ID]/[COMMENT_ID]`
  - Access limited to own user or users with permission `content.TYPE.comments.admin` or `content.TYPE.comments.update`
- `DELETE /api/comments/[TYPE]/[CONTENT_ID]/[COMMENT_ID]` 
  - Access limited to own user or users with permission `content.TYPE.comments.admin` or `content.TYPE.comments.delete`

### Activity

- `GET /api/activity/[USER_ID]`
  - Returns a list of activity for the user, access limited to own user or users with permission `activity.read` or `activity.admin`

