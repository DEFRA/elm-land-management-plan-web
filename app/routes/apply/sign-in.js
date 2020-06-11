module.exports = {
  method: 'GET',
  path: '/apply',
  options: {
    handler: async (request, h) => {
      try {
        return h.view('apply/sign-in')
      } catch (error) {
        console.error(error)
        return h.view('500')
      }
    }
  }
}
