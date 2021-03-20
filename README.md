<img src="./public/icons/icon-512x512.png" width="50px" />

# Edge - A multipurpose content platform

- [Website](https://edge-next.now.sh/)
- [Documentation](./DOCUMENTATION.md)
  

## Sponsors 

<a href="https://etereo.io" title="Etéreo" target="_blank"><img src="./public/static/sponsors/etereo.png" width="80px" /></a>

*Your name or company here?* Contact us at hello@etereo.io


## What is Edge? 

Edge is a piece of software written on top of Next.js to create a Dynamic API / Dynamic Dashboard and fully functional site to help makers, developers and other creators to deploy a minimum viable product in minutes.

The main features of Edge are:
- Dynamic content types and permissions, and APIs.
- Groups with private content, members and administrators.
- Comments on content types.
- Interactions on entities (like, follow, report, etc).
- Users APIs (login, register, update)
- Purchasing options and order management
  - You can use Edge as a order API for your own storefront, or use Edge as a full store yourself
- Emails (email verification, contact emails)
- Dynamic admin dashboard for all the content, groups and users.
- Block access to users to the site
- CSS themes that the user can change
- User activity log
- Login / Register with social providers
- A set of pre-implemented components
- PWA (Progressive Web APP)
- SSG (Static Site Generation) for static pages with markdown
- Entities Search (through mongo DB)
- Web monetization
- Easy to deploy
- Internationalization built in

If you want to read about all the features you can check the [Documentation](./DOCUMENTATION.md) or check the [Website Demo](https://edge-next.now.sh/).

You can login using one of the different social providers, or register a new account.

*The data on the demo site may be deleted at any time*


## How do I use Edge?

This tool is *not provided* as a package or framework you can add into your existing solutions. It is a solution by itself and it can fit your project for a determined set of use-cases. 

To use this tool:
- 1 Download or clone the repository
- 2 Do `yarn` or `npm install` 
- 3 Do `yarn dev` to launch your site (as any NextJS application)
- 4 Edit `edge.config.js` to add your own texts and content types or permissions
  - You can learn more on how to create new content types, permissions and themes in our tutorials
- 5 Deploy! 
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


## Deployments

Edge is deployed in 2 environments (DEV & PRO) on google app engine.
  
- Environment variables are configured under Github Secrets in 2 different variables
- ENV_VARIABLES_PRO (prod)
- ENV_VARIABLES (dev)

ENV_VARIABLES is a base64 encoded .env file with the following shape:

```
BASE_URL=http://localhost:5000
... rest of .env.build file
```

For the deployments we are using Github Actions and [Etereo Deploy GAE action](https://github.com/etereo-io/deploy-gae-action), that requires 

For more information, please check [Deployments Doc](./doc/DEPLOYMENTS.md)

-----------

 2020 - Original idea of [@rafinskipg](https://github.com/rafinskipg) and [@hayderaldeen](https://github.com/hayderaldeen). 

With the contribution of : 
- [@ihorkitrum](https://github.com/ihorkitrum) 
- [w3bdesign](https://github.com/w3bdesign)

With the Sponsorship of:
- [Etéreo](https://etereo.io)