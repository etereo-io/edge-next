# Empieza - Next Admin Kit & Dynamic API System

<img src="./public/static/logos/logo.svg" width="200px" />

------

## Sponsors 

<img src="./public/static/sponsors/etereo.png" width="200px" />

*Your name here?* Contact us at hello@empieza.io 


## What is Empieza? 

Empieza is a piece of software written on top of Next.js to create a Dynamic API / Dynamic Dashboard and fully functional site. 

The main features are:
- Dynamic content types and permissions
- Allow commenting on content types
- Users APIs (login, register, update)
- Dynamic admin dashboard for all the content, comments and users.

If you want to read about all the features you can check the [documentation](./static-pages/p/documentation.md) or check the [Website Demo](https://empieza-next.now.sh/) (login: admin@demo.com | password: admin)

## How to use this tool?

This tool is *not provided* as a package or framework you can add into your existing solutions. It is a solution by itself and it can fit you for a determined set of use-cases. 

To use this tool:
1- Download or clone the repository
2- Do `yarn` or `npm install` 
3 - Do `yarn dev` to launch your site (as any NextJS application)
4 - Edit `empieza.config.js` to add your own texts and content types or permissions
5 - Deploy! We recommend services like [Vercel](https://vercel.com)

## Contributing

Have you built anything cool by extending your own Empieza version? Send a Pull-Request and if it introduces a generic and configuration dependant setup we will add it to the main repository. This way, the next time you need to build that solution you will already have it ready.

Check our roadmap if you want to add more coool things into Empieza: 

## Roadmap

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

- Add a `sitemap.xml` API endpoint. 
  - Generate a dynamic sitemap by fetching the database for public content and adding also the static routes.

- Redux
  - Study if we will add redux for the dashboard 
    - https://github.com/willianantunes/nextjs-playground
    - https://github.com/kirill-konshin/next-redux-wrapper

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