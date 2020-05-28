describe('complianceService', () => {
  const Boom = require('@hapi/boom')

  const config = require('../../app/config')
  const complianceService = require('../../app/services/compliance-service')
  const restClient = require('../../app/utils/rest-client')

  jest.mock('../../app/utils/rest-client')

  const complianceServiceResponseWithoutSchemes = {
    headers: {
      statusCode: 204
    }
  }
  const complianceServiceResponseWithSchemes = {
    headers: {
      statusCode: 200
    },
    payload: [
      {
        schemeId: 's1',
        dateStart: '2017-08-01',
        dateEnd: '2019-08-01'
      },
      {
        schemeId: 's2',
        dateStart: '2016-01-01',
        dateEnd: '2018-07-01'
      },
      {
        schemeId: 's3',
        dateStart: '2015-01-01',
        dateEnd: '2020-01-01'
      }
    ]
  }
  const dateOutsideExistingSchemes = '2021-04-03'
  const dateWithinExistingScheme = '2017-03-17'
  const sbi = 's1'

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getExistingSchemes requests schemes from Compliance Service', async (done) => {
    const expectedRequestUrl = `${config.complianceServiceUrl}/schemes/${sbi}?date=${dateWithinExistingScheme}`

    restClient.get.mockImplementation(actualRequestUrl => {
      expect(actualRequestUrl).toBe(expectedRequestUrl)
      done()
      return complianceServiceResponseWithSchemes
    })

    expect.assertions(1)
    await complianceService.getExistingSchemes(sbi, dateWithinExistingScheme)
  })

  test('getExistingSchemes returns scheme data supplied by the Compliance Service', async () => {
    restClient.get.mockImplementation(() => complianceServiceResponseWithSchemes)

    const result = await complianceService.getExistingSchemes(sbi, dateWithinExistingScheme)

    expect(result).toEqual(expect.any(Array))
    expect(result).toContainEqual({ schemeId: 's2', dateStart: '2016-01-01', dateEnd: '2018-07-01' })
    expect(result).toContainEqual({ schemeId: 's3', dateStart: '2015-01-01', dateEnd: '2020-01-01' })
  })

  test('getExistingSchemes returns empty array if Compliance Service returns 204', async () => {
    restClient.get.mockImplementation(() => complianceServiceResponseWithoutSchemes)

    const result = await complianceService.getExistingSchemes(sbi, dateOutsideExistingSchemes)

    expect(result).toEqual(expect.any(Array))
    expect(result.length).toBe(0)
  })

  test('getExistingSchemes returns empty array if Compliance Service returns 404', async () => {
    restClient.get.mockImplementation(() => {
      throw Boom.notFound()
    })

    const result = await complianceService.getExistingSchemes(sbi, dateOutsideExistingSchemes)

    expect(result).toEqual(expect.any(Array))
    expect(result.length).toBe(0)
  })

  test('throws a "failed dependency" error if Compliance Service errors', async () => {
    restClient.get.mockImplementation(() => {
      throw Error()
    })

    let thrownError

    try {
      await complianceService.getExistingSchemes(sbi, dateWithinExistingScheme)
    } catch (error) {
      thrownError = error
    }

    expect(Boom.isBoom(thrownError)).toBe(true)
    expect(thrownError.output.statusCode).toBe(424)
    expect(thrownError.output.payload.message).toBe('Compliance Service failed to serve existing schemes data for the requested SBI')
  })
})
