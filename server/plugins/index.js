module.exports = {
  development: [
    require('blipp'),
    require('./logging')
  ],
  universal: [
    require('inert'),
    require('./api'),
    require('./error-pages'),
    require('./graceful-stop'),
    require('./views'), // views must come before router
    require('./router')
  ]
}
