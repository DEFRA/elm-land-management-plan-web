const fetch = require('node-fetch')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      let data = ''
      const getData = async url => {
        try {
          const response = await fetch(url)
          data = await response.json()
        } catch (error) {
          data = error
        }
      }
      await getData('http://elm-lmp-api:3001/viewcount')
      console.log(data)
      return h.view('home', {
        title: 'ELM Land Management Plan',
        viewcount: data.viewcount
      })
    }
  }
}
