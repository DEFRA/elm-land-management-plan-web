describe('GET /apply/{sbi}', () => {
  const config = require('../../../app/config')
  const restClient = require('../../../app/utils/rest-client')

  jest.mock('../../../app/utils/rest-client')

  const sbi = 1
  const getParcelsUrl = `${config.rpaLandServiceUrl}/LandParcels/MapServer/0/query?where=SBI=${sbi}&outFields=*&f=geojson`
  const getParcelsResponse = {
    payload: {
      features: [
        {
          properties: {
            area_ha: 99,
            parcel_id: 1
          }
        }
      ]
    }
  }

  let createServer
  let server

  beforeAll(async () => {
    createServer = require('../../../app/server')
  })

  beforeEach(async () => {
    restClient.get.mockImplementation(() => getParcelsResponse)

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    jest.resetAllMocks()
    await server.stop()
  })

  test('returns 200 with HTML payload', async () => {
    const options = {
      method: 'GET',
      url: `/apply/${sbi}`
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8')
  })

  test('fetches parcel data from RPA land API', async () => {
    const options = {
      method: 'GET',
      url: `/apply/${sbi}`
    }

    await server.inject(options)
    expect(restClient.get).toHaveBeenCalledWith(getParcelsUrl)
  })
})
