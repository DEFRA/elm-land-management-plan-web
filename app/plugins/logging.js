const config = require('../config')

module.exports = {
  plugin: require('@hapi/good'),
  options: {
    ops: {
      interval: 1000
    },
    reporters: {
      console: [
        {
          module: '@hapi/good-squeeze',
          name: 'Squeeze',
          args: [
            {
              log: '*',
              error: '*',
              request: config.logRequests ? '*' : [''],
              response: config.logRequests ? '*' : ['']
            }
          ]
        },
        {
          module: '@hapi/good-console'
        },
        'stdout'
      ]
    }
  }
}
