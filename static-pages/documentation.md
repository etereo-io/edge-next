---
title: Documentation
description: "Empieza Documentation"
---

# Documentation

- [Documentation](#documentation)
  - [Features](#features)
  - [edge.config.js](#edgeconfigjs)
  - [Content Types](#content-types)
  - [Fields](#fields)
    - [Options for each field type](#options-for-each-field-type)
  - [API](#api)
    - [Auth](#auth)
    - [Users](#users)
    - [Content](#content)
    - [Comments](#comments)
    - [Activity](#activity)
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
  - [Payments](#payments)
  - [Deploy your own](#deploy-your-own)
    - [Deploying on Vercel](#deploying-on-vercel)



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
- Easy to deploy
  - Deploy on platforms like Vercel in minutes
- ~Multilingual support~
 

## edge.config.js

All the configuration of Edge is done in this file on the root of the folder. 

Here users can define content types, permissions and much more. 

Example config file [here](/p/configuration-file)

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
- errorMessage: String, error message displayed when validation fails
- validation (NOT IMPLEMENTED)
  - Optional validarion function in the form of `(value) => { return true or false } `
- permissions (NOT IMPLEMENTED)
  - Array, list of roles that can SEE this field when editing the content and when reading it

Example: 

```javascript
const contentType = {
  fields: [{
    label: 'My field',
    type: 'text',
    required: true,
    name: 'myfield'
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
- `GET /api/users/ID` | `GET /api/users/me`
  - Access limited to own user or users with permission `user.read` or `user.admin`
- `POST /api/users`
  - Access limited to `user.admin`
- `PUT /api/users/ID`
  - Access limited to own user or users with permission `user.admin` and `user.write`
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

### Activity

- `GET /api/activity/[USER_ID]`
  - Returns a list of activity for the user, access limited to own user or users with permission `activity.read` or `activity.admin`


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

- [Register your Github application](https://developer.github.com/v3/guides/basics-of-authentication/)
- [Register your Google application](https://developers.google.com/identity/sign-in/web/sign-in)
- [Register your Facebook application](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/)

## Emails

Empieza uses [Sendgrid](https://sendgrid.com/) to send emails. Although this is easily editable, just edit `/lib/email/sender.js` to change the sending implementations.

There are some email templates included and working:

- Call to Action template: A simple template with a button. Used to verify user emails.


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

## Payments

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

*We strongly recommend you to code payment systems with caution*

[Stripe DOCS](https://stripe.com/docs/)
[Getting Charges](https://stripe.com/docs/connect/charges)

## Deploy your own

To deploy your site with all the functionalities you need to configure the different environment variables.

All the environment variables are defined inside the `.env.build` example file

```
BASE_URL=http://localhost:3000
FIREBASE_PROJECT_ID=XX
FIREBASE_CLIENT_EMAIL=XX
FIREBASE_DATABASE_URL=XX
FIREBASE_PRIVATE_KEY=XX
MONGODB_URI=MONGODB_URI=mongodb+srv://<username>:<password>@<url>
MONGODB_DATABASE=<database>
NEXT_PUBLIC_GMAPS_API_KEY=XXXX
SENDGRID_KEY=XXX
```

### Deploying on Vercel

Deploy Empieza using [Vercel](https://vercel.com):


If you want your deployment in Vercel to recognize the `ENVIRONMENT` values, you will need to add the secrets to your deployment. 

You can add them through the command line or through the administration dashboard in Vercel.com

![](/static/docs/env-variables-vercel-2.png)