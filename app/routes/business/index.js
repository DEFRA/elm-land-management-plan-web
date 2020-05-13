module.exports = {
  method: 'GET',
  path: '/business',
  options: {
    handler: async (request, h) => {
      try {
        const businesses = [
          { sbi: 106599008 }
        ]
        return h.view('business/list', { businesses })
      } catch (error) {
        console.error(error)
        return h.view('500')
      }
    }
  }
}
