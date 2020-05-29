describe('POST /apply/sign-in-submit', () => {
  let createServer
  let server

  beforeAll(async () => {
    createServer = require('../../../app/server')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('redirects to businesses list', async () => {
    const options = {
      method: 'POST',
      url: '/apply/sign-in-submit'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8')
    expect(response.headers.location).toBe('/apply/businesses')
  })
})
