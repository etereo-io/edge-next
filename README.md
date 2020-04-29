# Empieza - Next Admin Kit & Dynamic API System

<img src="./public/static/logos/logo.svg" width="200px" />

------

## What is Empieza? 

If you want to read about all the features you can check the [documentation](./static-pages/p/documentation.md) or check the [Website Demo](https://empieza-next.now.sh/) (login: admin@demo.com | password: admin)

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