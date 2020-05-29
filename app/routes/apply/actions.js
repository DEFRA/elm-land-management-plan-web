
const businesses = require('../../data/businesses.json')

module.exports = {
  method: 'GET',
  path: '/apply/businesses/{sbi}/actions',
  options: {
    handler: async (request, h) => {
      const { sbi } = request.params
      const business = businesses.filter(item => item.sbi === sbi)[0]

      return h.view('apply/actions', { business })
    }
  }
}
