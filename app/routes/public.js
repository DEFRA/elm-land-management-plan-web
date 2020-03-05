const config = require('../config')

module.exports = [{
  method: 'GET',
  path: '/robots.txt',
  options: {
    handler: {
      file: 'app/public/static/robots.txt'
    },
    cache: {
      expiresIn: config.staticCacheTimeoutMillis,
      privacy: 'private'
    }
  }
}, {
  method: 'GET',
  path: '/assets/all.js',
  options: {
    handler: {
      file: 'node_modules/govuk-frontend/govuk/all.js'
    },
    cache: {
      expiresIn: config.staticCacheTimeoutMillis,
      privacy: 'private'
    }
  }
}, {
  method: 'GET',
  path: '/assets/{path*}',
  options: {
    handler: {
      directory: {
        path: [
          'app/public/static',
          'app/public/build',
          'node_modules/govuk-frontend/govuk/assets'
        ]
      }
    },
    cache: {
      expiresIn: config.staticCacheTimeoutMillis,
      privacy: 'private'
    }
  }
}]
