# Documentation

- [Documentation](#documentation)
  - [Features](#features)
  - [How to start using Edge.](#how-to-start-using-edge)
  - [edge.config.js](#edgeconfigjs)
  - [Adding a new theme](#adding-a-new-theme)
  - [Content Types](#content-types)
  - [Groups](#groups)
    - [How groups work?](#how-groups-work)
  - [Fields](#fields)
    - [Options for each field type](#options-for-each-field-type)
  - [Storage](#storage)
    - [Google](#google)
    - [Azure](#azure)
  - [Databases](#databases)
    - [Database API](#database-api)
      - [Adding items](#adding-items)
      - [Finding items](#finding-items)
      - [Updating an item](#updating-an-item)
      - [Deleting items](#deleting-items)
    - [In memory DB (only local)](#in-memory-db-only-local)
    - [MongoDB (default)](#mongodb-default)
  - [Authentication](#authentication)
    - [Providers](#providers)
  - [Emails](#emails)
  - [Static Pages](#static-pages)
  - [Web monetization](#web-monetization)
  - [Other Payments](#other-payments)
- [env.local file](#envlocal-file)
  - [Deploy your own](#deploy-your-own)
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
   - Google storage/Azure Blob Storage
   - Social provider apps for sign-in/sign-up (github, facebook, google)
   - Mongo db database
4) Configure the environment variables in the `.env.local` file.
5) Run with `yarn dev` or `npm run dev`
 

## edge.config.js

All the configuration of Edge is done in this file on the root of the folder. 

Here users can define content types, permissions and much more. 

Example config file [here](/configuration-file.md)


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
Content types may be defined in `edge.config.js`. You can create as many content types with different definitions and permissions. The API will validate the access to the endpoints based on the permissions you defined.

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

## Groups

Groups are a conjunction of rules that applies to content and users. Groups can help to model different functionalities like:
- Projects (with members and tasks)
- Publishing groups (similar to medium publishing groups)
- Meetup groups 

### How groups work?

When a group is created, the author is asigned the role of `GROUP_ADMIN`, after that it becomes possible to add new users manually. Group permissions are not dynamic for each group, they are configured in `edge.config.js`. This is a caveat and it doesn't allow to create private and public groups of the same group type. 

Let's see the group definition to make it more clear.

In an example site we want to create a group called `Project` with the following characteristics: 
- Projects are public for registered users. Any user may find projects.
- The content inside the project is private for the users on that project. 
- Users can only be added by a `GROUP_ADMIN` or a `GROUP_MEMBER` not anyone can join freely.
- Inside the project members may create tasks. Tasks are a content type defined in the content type definitions as seen previously.

```javascript
const projectGroupType = {
    title: 'Project',

    // Identificator type for API and website calls /api/groups/project /groups/project
    slug: 'project',

    permissions: {
      // Any user may list projects
      read: ['USER'],

      // Any user may create projects
      create: ['USER'],

      // Only admins may update, delete or administer ANY project on the platform. 
      update: ['ADMIN'],
      delete: ['ADMIN'],
      admin: ['ADMIN'],
    },

    // Roles that group members can have
    roles: [
      {
        label: 'Group Member',
        value: 'GROUP_MEMBER',
      },
      {
        label: 'Group admin',
        value: 'GROUP_ADMIN',
      },
    ],

    // Allow keep projects as draft while creating them
    publishing: {
      draftMode: true,
      title: 'title',
    },

    // Group user permissions
    user: {
      // Default require approval or not
      requireApproval: true,

      permissions: {
        // Who can see the other members of the group
        read: ['GROUP_MEMBER'],
    
        // Who can make request to join to the group
        join: ['USER'],

        // Who can invite or add group members
        create: ['GROUP_ADMIN', 'ADMIN'],

        // Who can change group member roles
        update: ['GROUP_ADMIN','ADMIN'],

        // Who can remove users from the group
        delete: ['GROUP_ADMIN','ADMIN'],

        // Who can do all the above
        admin: ['GROUP_ADMIN','ADMIN'],
      },
    },

    // Differnt content types may be defined in a group
    contentTypes: [{
      slug: 'task',
      permissions: {
        // Who can see the tasks of this project
        read: ['GROUP_MEMBER'],
        // Who can add tasks in this project
        create: ['GROUP_MEMBER'],
        // Who can update tasks in this project
        update: ['GROUP_ADMIN'],
        // Who can delete tasks in this project
        delete: ['GROUP_ADMIN'],
        // Who can administer tasks in this project
        admin: ['GROUP_ADMIN']
      }
    }],

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'Title',
        minlength: 8,
        maxlength: 150,
        required: true,
        errorMessage: 'Title must be between 8 and 150 characters',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description',
        minlength: 1,
        maxlength: 200,
        required: true,
        description: 'Tell the world something about this publication group (max 200 characters)'
      }
    ],
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
- password
  - Available options:
    - min
    - max
    - required
    - placeholder
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
- entity_search
  - It will show a text input for searching and linking one or multiple entities from the database. 
    - The stored field will have the id and text representation of the entity
  - Available options:
    - entity
      - `user`, `content`, `group`
    - entityType
      - a group type or a content type
    - multiple
      - allow to select multiple items
    - entityName 
      - A function to extract the text representation of the entity selected. for example: (user) => u.username, this value will be stored in the database.
- rich_text
  - Available options:
    - required
    - placeholder
    - defaultValue


You can see the example configuration file for more details about content types and fields.

In the [components page](/components) you will find more implemented dynamic fields.

## Storage

To upload images and other files you will need to configure a storage. 

Different options are: GOOGLE or AZURE.

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

### Azure

To configure Azure Blob Storage you will need to follow the steps described [there](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-nodejs). You have to create a service account and a container with public visibility.

The environment variables you need to configure are :

````
AZURE_STORAGE_ACCOUNT=XXX
AZURE_STORAGE_CONTAINER=XXX
AZURE_STORAGE_CONNECTION_STRING=XXX
````

Another useful resources:
- [Blobs managing](https://www.npmjs.com/package/azure-storage) 
- [Service information for NodeJS applications](https://www.infragistics.com/community/blogs/b/mihail_mateev/posts/how-to-manage-microsoft-azure-blob-storage-with-node-js) 


## Databases
Different databases can be configured, MongoDB and "In Memory".  All the Databases use the same API, this way is easy to switch from one to the other. But if you don't like this approach you can change `/lib/api/db` and `/lib/api/entities/` to use your database in the way you want.

**Note: The only production ready database is MongoDB**.

### Database API 

All database modules are implemented Abstract Database class to have the same API. You can find all possible methods and their descriptions in the `/lib/api/db/Database.ts` file.


#### Adding items

```javascript
db.collection('collection')
  .add(item)
```

#### Finding items

```javascript
db.collection('collection')
  .find({name: 'test'}, {
    sortBy: 'date',
    sortOrder: 'DESC'
  })
```

```javascript
db.collection('collection')
  .findOne({name: 'test'})
```

Limit start and end positions

```javascript
db
  .collection('col')
  .limit(10)
  .start(0)
  .find(options, {
    sortBy,
    sortOrder,
  })

```

#### Updating an item

```javascript
db.collection('collection')
  .doc('ID')
  .set({name: 'test'})
```

#### Deleting items

Many 
```javascript
db.collection('collection')
  .remove(options)
```

One 
```javascript
db.collection('collection')
  .remove(options, true)
```


### In memory DB (only local)

There is a "In memory" database for development and testing purposes. It allows you to work with Mock data easily. But the capabilities are limited.

Set the following config (default)

```javascript
database: {
  type: 'IN_MEMORY'
}
```

### MongoDB (default)

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

## Authentication 

Edge uses [Passport.js](http://www.passportjs.org) cookie based authentication with email and password.

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

```
FACEBOOK_ID=XX
FACEBOOK_SECRET=XX
GITHUB_ID=XX
GITHUB_SECRET=XX
GOOGLE_ID=XX
GOOGLE_SECRET=XX
```

In the Oauth callbacks fill in the following API urls:

```
YOURSITE.COM/api/auth/github/callback
YOURSITE.COM/api/auth/facebook/callback
YOURSITE.COM/api/auth/google/callback
```

You don't need to configure any or all of the authentication providers. You can disable them on the `edge.config.js` file.


## Emails

Edge uses [Sendgrid](https://sendgrid.com/) to send emails. Although this is easily editable; just edit `/lib/email/sender.js` to change the sending implementations.

There are some email templates included and working:

- Call to Action template: A simple template with a button. Used to verify user emails.

Some resources:

- [Get a sendgrid API key](https://www.youtube.com/watch?v=ShOQxpX7Dcw)

Once you have your sendgrid API key you will need to include it on the environment file:

```
SENDGRID_KEY=XX
```

## Static Pages

SSG (Static Site Generation) is implemented. 
In the folder `static-pages` you can find the different markdown pages that are prerendered for fast loading.
The pages include common use cases like **About**, **Privacy Policy**, **Terms and conditions**.

```markdown
---
title: Example page
description: "Example page description"
---


# THIS IS A TITLE

Hello, this is a static page, automatically rendered.

```

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

Please follow the [deployments documentation](./doc/DEPLOYMENTS.md) 


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

### Groups 
- `GET /api/groups/[GROUP_TYPE]`
  - Access limited to users with permission `group.TYPE.read` or `group.TYPE.admin`
  - Retrieving a list of all groups based on the group type
- `GET /api/groups/[GROUP_TYPE]/[GROUP_SLUG]` | `GET /api/content/[GROUP_TYPE]/[GROUP_ID]?field=id`
  - Access limited to own user or users with permission `group.TYPE.read` or `group.TYPE.admin`
  - Retrieving a specific group base on group type and group slug/id
- `GET /api/groups/[GROUP_TYPE]/[GROUP_SLUG]/users`
  - Access limited to own user or users with permission `group.TYPE.user.read`, `group.TYPE.user.admin`, `group.TYPE.admin` or `user.admin`
  - Retrieving a list of all group members bases on group type and group slug
- `GET /api/groups/[GROUP_TYPE]/[GROUP_SLUG]/users/[USER_ID]`
  - Access limited to own user or users with permission `group.TYPE.user.read`, `group.TYPE.user.admin`, `group.TYPE.admin` or `user.admin`
  - Retrieving a specific group member info based on group type and group slug
- `POST /api/groups/[GROUP_TYPE]`
  - Access limited to `group.TYPE.admin`, or `group.TYPE.create`
  - Creation of a group with specific type
- `POST /api/groups/[GROUP_TYPE]/[GROUP_SLUG]/users`
  - Access limited to `group.TYPE.user.admin`, `group.TYPE.user.create`, `group.TYPE.user.join`, `group.TYPE.admin` or `user.admin`
  - Adding users to members list or to pending members list if group requires approval. You can't add anybody else to pending list but yourself
- `PUT /api/groups/[GROUP_TYPE]/[GROUP_SLUG]` | `POST /api/groups/[GROUP_TYPE]/[GROUP_SLUG]` |  `PUT /api/groups/[GROUP_TYPE]/[GROUP_ID]?field=id` |  `POST /api/groups/[GROUP_TYPE]/[GROUP_ID]?field=id`
  - Access limited to own user or users with permission `group.TYPE.admin` or `group.TYPE.update`
  - Updating group based on group type and group slug
- `PUT /api/groups/[GROUP_TYPE]/[GROUP_SLUG]/users/[USER_ID]` | `PUT /api/groups/[GROUP_TYPE]/[GROUP_SLUG]/users/[USER_ID]?action=approve`
  - Access limited to `group.TYPE.user.admin`, `group.TYPE.user.update`, `group.TYPE.admin` or `user.admin`
  - Updating a specific user based on group type, group slug and user id. It's possible to update the particular user in the members list or move user from pending members list to members list
- `DELETE /api/content/[GROUP_TYPE]/[GROUP_SLUG]` | `DELETE /api/content/[GROUP_TYPE]/[GROUP_ID]?field=id`
  - Access limited to own user or users with permission `group.TYPE.admin` or `group.TYPE.delete`
  - Removing a group from the system based on group type and group slug/id
- `DELETE /api/content/[GROUP_TYPE]/[GROUP_SLUG]/users/[USER_ID]`
  - Access limited to own user or users with permission `group.TYPE.user.delete`, `group.TYPE.user.admin`, `group.TYPE.admin` or `user.admin`
  - Removing a member from the group based on group type, group slug and user id

### Content
- `GET /api/content/[TYPE]`
  - Access limited to users with permission `content.TYPE.read` or `content.TYPE.admin`
- `GET /api/content/[TYPE]/[CONTENT_SLUG]` | `GET /api/content/[TYPE]/[CONTENT_ID]?field=id`
  - Access limited to own user or users with permission `content.TYPE.read` or `content.TYPE.admin`
- `POST /api/content/[TYPE]`
  - Access limited to `content.TYPE.admin`, or `content.TYPE.create`
- `PUT /api/content/[TYPE]/[CONTENT_SLUG]` | `POST /api/content/[TYPE]/[CONTENT_SLUG]` |  `PUT /api/content/[TYPE]/[CONTENT_ID]?field=id` |  `POST /api/content/[TYPE]/[CONTENT_ID]?field=id`
  - Access limited to own user or users with permission `content.TYPE.admin` or `content.TYPE.update`
- `DELETE /api/content/[TYPE]/[CONTENT_SLUG]` | `DELETE /api/content/[TYPE]/[CONTENT_ID]?field=id`
  - Access limited to own user or users with permission `content.TYPE.admin` or `content.TYPE.delete`

### Comments

- `GET /api/comments?contentType=CONTENT_TYPE`
  - Access limited to users with permission `content.TYPE.comments.read` or `content.TYPE.comments.admin`. If no CONTENT_TYPE is specified, it will list all the comments that the current user has access to.
  - Other filters available are `contentId`, `author` (user id), `conversationId` (can be set to the string `'false'` to ellicit empty conversationIds)

- `POST /api/comments?contentId=CONTENT_ID&contentType=CONTENT_TYPE`
  - Access limited to `content.TYPE.comments.admin`, or `content.TYPE.comments.create`

- `GET /api/comments/[COMMENT_SLUG]` or `GET /api/comments/[COMMENT_ID]?field=id` 
  - Access limited to own user or users with permission `content.TYPE.comments.read` or `content.TYPE.comments.admin`
- `DELETE /api/comments/[COMMENT_SLUG]` or `DELETE /api/comments/[COMMENT_ID]?field=id` 
  - Access limited to own user or users with permission `content.TYPE.comments.admin` or `content.TYPE.comments.delete`

### Activity

- `GET /api/activity/[USER_ID]`
  - Returns a list of activity for the user, access limited to own user or users with permission `activity.read` or `activity.admin`

