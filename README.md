<img src="./public/icons/icon-512x512.png" width="50px" />

# Edge - A dynamic site that lives on the edge


## Sponsors 

<a href="https://etereo.io" title="Etéreo" target="_blank"><img src="./public/static/sponsors/etereo.png" width="80px" /></a>

*Your name or company here?* Contact us at INSERT_MAIL


## What is Edge? 

Edge is a piece of software written on top of Next.js to create a Dynamic API / Dynamic Dashboard and fully functional site to help makers, developers and other creators to deploy a minimum viable product in minutes.

The main features of Edge are:
- Dynamic content types and permissions, and APIs.
- Comments on content types
- Users APIs (login, register, update)
- Emails (email verification, contact emails) templates and implementation
- Dynamic admin dashboard for all the content, comments and users.
- Block users the access to the site
- CSS themes that the user can change
- User activity log
- Login / Register with social providers
- A set of pre-implemented components
- PWA (Progressive Web APP)
- SSG (Static Site Generation) for static pages with markdown
- Easy to deploy

If you want to read about all the features you can check the [documentation](./static-pages/p/documentation.md) or check the [Website Demo](https://edge-next.now.sh/).

You can login with the following credentials:
- Admin: admin@demo.com | password: admin
- User: user@demo.com | password: user

## How do I use Edge?

This tool is *not provided* as a package or framework you can add into your existing solutions. It is a solution by itself and it can fit your project for a determined set of use-cases. 

To use this tool:
- 1 Download or clone the repository
- 2 Do `yarn` or `npm install` 
- 3 Do `yarn dev` to launch your site (as any NextJS application)
- 4 Edit `edge.config.js` to add your own texts and content types or permissions
  - You can learn more on how to create new content types, permissions and themes in our tutorials
- 5 Deploy! We recommend services like [Vercel](https://vercel.com)
  - Check how to configure all the different providers in the documentation. You will need to create different set of environment variables and register in the different services like Email and Database.

## Issues

Do you have any problem understanding how to use Edge? 
Something is broken?
Any doubt?

- First: Check if there is any open issue
- Second: If not, create a new one

## Contributing

Did you build anything cool by extending your own Edge version? Send a Pull-Request and if it introduces a generic and configurable solution we will add it to the main repository. 

Do you think you can introduce best practices on the repository? Send us a pull request.

Do you think you can improve the performance of the solution? Send us a pull request.

Check our roadmap if you want to add more cool things into Edge.

## Roadmap

- Get 100% on everything on lighthouse

- Add an example google analytics script

- Create an example site running an online shop
  - Create the concept of "shopping cart"
  - Integrate with a payment provider
  - Add a "buyable" option into content types

- Add site stats
  - Store stats for each page visit
  - Display the stats into the admin dashboard
  - Create stats components

- Add i18n
  - Internationalization can be done using `react-intl` and getInitialProps in the server side, for loading only the correct language. https://github.com/PaulPCIO/nextjs-with-react-intl
  - We don't want to make all the pages dependant on server-rendered code, avoid if possible.
  - NextJS is preparing a RFC for i18n we will wait on that

- Add a `sitemap.xml` API endpoint. 
  - Generate a dynamic sitemap by fetching the database for public content and adding also the static routes.

- Redux
  - Study if we will add redux for the dashboard 
    - https://github.com/willianantunes/nextjs-playground
    - https://github.com/kirill-konshin/next-redux-wrapper

- Connect to a database
  - Firebase
  - ~MongoDB~
  - ~In Memory DB~

- Comments
  - Add integration tests and complete functionality
  - https://docs.mongodb.com/drivers/use-cases/storing-comments
  
- Content CRUD
  - Document and finish permissions on content api
  - Add validations on client side and server side
  - Allow to upload files
  - Link author

- User
  - Add more social provider integrations

- Startup script
  - Preseed database 

- Dockerfile
  - See how to complete a good example


-----------

 2020 - Original idea of [@rafinskipg](https://github.com/rafinskipg) and [@hayderaldeen](https://github.com/hayderaldeen)

