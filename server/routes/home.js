const fetch = require('node-fetch')

const getData = async (url) => new Promise(async (resolve, reject) => {
  try {
    const response = await fetch(url)
    resolve(await response.json())
  } catch (error) {
    reject(error)
  }
})

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      const data = await getData('http://elm-lmp-api:3001/viewcount')

      return h.view('home', {
        title: 'ELM Land Management Plan',
        viewcount: data.viewcount
      })
    }
  }
}
