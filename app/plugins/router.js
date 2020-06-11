const routes = [].concat(
  require('../routes/apply/actions'),
  require('../routes/apply/business'),
  require('../routes/apply/businesses'),
  require('../routes/apply/eligibility'),
  require('../routes/apply/sign-in'),
  require('../routes/apply/sign-in-submit'),
  require('../routes/home'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/public')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
