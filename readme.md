[![Build Status](https://travis-ci.org/DEFRA/hapi-web-boilerplate.svg?branch=master)](https://travis-ci.org/DEFRA/hapi-web-boilerplate) [![Maintainability](https://api.codeclimate.com/v1/badges/5c3956c73c9b1496dadd/maintainability)](https://codeclimate.com/github/DEFRA/hapi-web-boilerplate/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/5c3956c73c9b1496dadd/test_coverage)](https://codeclimate.com/github/DEFRA/hapi-web-boilerplate/test_coverage) [![Greenkeeper badge](https://badges.greenkeeper.io/DEFRA/hapi-web-boilerplate.svg)](https://greenkeeper.io/)
# Land Management Plan web front end
This is the web front end for the Land Management Plan portion of the ELM service

# Environment variables

| name     | description      | required | default |            valid            | notes |
|----------|------------------|:--------:|---------|:---------------------------:|-------|
| NODE_ENV | Node environment |    no    |         | development,test,production |       |
| PORT     | Port number      |    no    | 3000    |                             |       |

# Pipeline variables
This project expects to be built using continuous integration in Azure Pipelines. The pipeline should be configured with the following variables:

| name                   | description                                              |
|------------------------|----------------------------------------------------------|
| azureContainerRegistry | Name of Docker image registry connection in Azure DevOps |

# Prerequisites

Node v8+

For the pa11y tests to run on Ubuntu (including Ubuntu on WSL) the following packages must be installed.

gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Running the application

This application builds to a Docker image and is intended to run alongside other services in a Kubernetes environment. Use `kubectl` to run a Kubernetes stack on your local machine.

```
# Build container images
bin/docker/build

# Start NGINX Ingress Controller
bin/start-ingress

# Deploy app to local cluster
kubectl apply -f kubernetes/
```

For more information about the NGINX Ingress Controller, see: `https://kubernetes.github.io/ingress-nginx/`.

## Config

The configuration file for the server is found at `server/config.js`.
This is where to put any config and all config should be read from the environment.
The final config object should be validated using joi and the application should not start otherwise.

A table of environment variables should be maintained in this README.

Default values appropriate for development environments are declared in `.env`, which is automatically read by `docker-compose`.

## Plugins

hapi has a powerful plugin system and all server code should be loaded in a plugin.

Plugins live in the `server/plugins` directory.

## Logging

The [good](https://github.com/hapijs/good) and [good-console](https://github.com/hapijs/good-console) plugins are included and configured in `server/plugins/logging`

The logging plugin is only registered in when `NODE_ENV=development`.

Error logging for production should use errbit.

## Views

The [vison](https://github.com/hapijs/vision) plugin is used for template rendering support.

The template engine used in nunjucks inline with the GDS Design System with support for view caching, layouts, partials and helpers.

## Static files

The [Inert](https://github.com/hapijs/inert) plugin is used for static file and directory handling in hapi.js.
Put all static assets in `server/public/static`.

Any build output should write to `server/public/build`. This path is in the `.gitignore` and is therefore not checked into source control.

## Routes

Incoming requests are handled by the server via routes.
Each route describes an HTTP endpoint with a path, method, and other properties.

Routes are found in the `server/routes` directory and loaded using the `server/plugins/router.js` plugin.

Hapi supports registering routes individually or in a batch.
Each route file can therefore export a single route object or an array of route objects.

A single route looks like this:

```js
{
  method: 'GET',
  path: '/hello-world',
  options: {
    handler: (request, h) => {
      return 'hello world'
    }
  }
}
```

There are lots of [route options](http://hapijs.com/api#route-options), here's the documentation on [hapi routes](http://hapijs.com/tutorials/routing)

## Tasks

Shell scripts are provided in `bin/docker` for building and testing this application using Docker. Specific tasks are declard as NPM scripts in `package.json` and run within short-lived containers so the only dependency on the host system is a running Docker instance.

### NPM Scripts

The predefined tasks from the Defra boilerplate project are:

- `npm run build` (Runs all build sub-tasks)
- `npm run build:css` (Builds the client-side sass)
- `npm run lint` (Runs the lint task using standard.js)
- `npm run unit-test` (Runs the `lab` tests in the `/test` folder)
- `npm test` (Runs the `lint` task then the `unit-tests`)

Additional tasks for this project are:

- `npm run pa11y-test` (Runs the `pa11y-ci` tests against the urls in the `.pa11yci` file)
- `npm run snyk-test` (Runs `snyk` tests)
- `npm run all-tests` (Runs all tests)
- `npm run start` (Starts the server)
- `npm run start-quiet` (Starts the server without logging anything to console)

### Resources

For more information around using `npm-scripts` as a build tool:

- http://substack.net/task_automation_with_npm_run
- http://ponyfoo.com/articles/choose-grunt-gulp-or-npm
- http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/
- http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/

## Testing

[lab](https://github.com/hapijs/lab) and [code](https://github.com/hapijs/code) are used for unit testing.

See the `/test` folder for more information.

## Linting

[standard.js](http://standardjs.com/) is used to lint both the server-side and client-side javascript code.

It's defined as a build task and can be run using `npm run lint`.
