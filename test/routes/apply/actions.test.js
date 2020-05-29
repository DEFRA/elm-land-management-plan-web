describe('GET /apply/businesses/{sbi}/actions', () => {
  const sbi = '106599008'

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

  test('returns 200 with HTML payload', async () => {
    const options = {
      method: 'GET',
      url: `/apply/businesses/${sbi}/actions`
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8')
  })
})
