module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      const data = await request.server.methods.api.getJson('http://elm-lmp-api:3001/viewcount')

      return h.view('home', {
        title: 'ELM Land Management Plan',
        viewcount: data.viewcount
      })
    }
  }
}
