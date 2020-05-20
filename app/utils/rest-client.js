const config = require('../config')

module.exports = require('@hapi/wreck').defaults({
  json: true,
  timeout: config.restClientTimeoutMillis
})
