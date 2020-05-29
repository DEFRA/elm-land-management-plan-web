module.exports = {
  method: 'GET',
  path: '/apply',
  options: {
    handler: async (request, h) => {
      try {
        const businesses = [
          { sbi: 106599008 }
        ]
        return h.view('apply/sign-in', { businesses })
      } catch (error) {
        console.error(error)
        return h.view('500')
      }
    }
  }
}
