const businesses = require('../../data/businesses.json')

module.exports = {
  method: 'GET',
  path: '/apply/businesses',
  options: {
    handler: async (request, h) => {
      try {
        return h.view('apply/businesses', { businesses })
      } catch (error) {
        console.error(error)
        return h.view('500')
      }
    }
  }
}
