describe('landService', () => {
  const Boom = require('@hapi/boom')

  const config = require('../../app/config')
  const landService = require('../../app/services/land-service')
  const restClient = require('../../app/utils/rest-client')

  jest.mock('../../app/utils/rest-client')

  const rpaLandServiceResponseNotFound = {
    payload: {
      features: []
    }
  }
  const rpaLandServiceResponseOk = {
    payload: {
      features: [
        { properties: { parcel_id: 'p1', area_ha: 2.43612 } },
        { properties: { parcel_id: 'p2', area_ha: 3.87654 } },
        { properties: { parcel_id: 'p3', area_ha: 1.19236 } },
        { properties: { parcel_id: 'p4', area_ha: 0.91726 } },
        { properties: { parcel_id: 'p5', area_ha: 2.12937 } }
      ]
    }
  }
  const sbi = 's1'

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getParcels requests data from RPA Land Service API', async (done) => {
    const expectedRequestUrl = `${config.rpaLandServiceUrl}/LandParcels/MapServer/0/query?where=SBI=${sbi}&outFields=*&f=geojson`

    restClient.get.mockImplementation(actualRequestUrl => {
      expect(actualRequestUrl).toBe(expectedRequestUrl)
      done()
      return rpaLandServiceResponseOk
    })

    expect.assertions(1)
    await landService.getParcels(sbi)
  })

  test('getParcels returns parcel IDs and areas', async () => {
    restClient.get.mockImplementation(() => rpaLandServiceResponseOk)

    const result = await landService.getParcels(sbi)

    expect(result).toContainEqual({ parcelId: 'p1', hectares: 2.43612 })
    expect(result).toContainEqual({ parcelId: 'p2', hectares: 3.87654 })
    expect(result).toContainEqual({ parcelId: 'p3', hectares: 1.19236 })
    expect(result).toContainEqual({ parcelId: 'p4', hectares: 0.91726 })
    expect(result).toContainEqual({ parcelId: 'p5', hectares: 2.12937 })
  })

  test('throws a "not found" error if RPA Land Service returns no features', async () => {
    restClient.get.mockImplementation(() => rpaLandServiceResponseNotFound)

    let thrownError

    try {
      await landService.getParcels(sbi)
    } catch (error) {
      thrownError = error
    }

    expect(Boom.isBoom(thrownError)).toBe(true)
    expect(thrownError.output.statusCode).toBe(404)
    expect(thrownError.output.payload.message).toBe('No parcel data found for requested SBI')
  })

  test('throws a "failed dependency" error if RPA Land Service errors', async () => {
    restClient.get.mockImplementation(() => {
      throw Error()
    })

    let thrownError

    try {
      await landService.getParcels(sbi)
    } catch (error) {
      thrownError = error
    }

    expect(Boom.isBoom(thrownError)).toBe(true)
    expect(thrownError.output.statusCode).toBe(424)
    expect(thrownError.output.payload.message).toBe('RPA Land Service failed to serve parcel data for the requested SBI')
  })

  test('throws a "failed dependency" error if RPA Land Service response has no features array', async () => {
    restClient.get.mockImplementation(() => ({ payload: {} }))

    let thrownError

    try {
      await landService.getParcels(sbi)
    } catch (error) {
      thrownError = error
    }

    expect(Boom.isBoom(thrownError)).toBe(true)
    expect(thrownError.output.statusCode).toBe(424)
    expect(thrownError.output.payload.message).toEqual(expect.stringContaining('RPA Land Service gave an invalid response'))
  })
})
