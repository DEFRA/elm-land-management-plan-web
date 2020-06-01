describe('GET /apply/businesses/{sbi}/eligibility', () => {
  const config = require('../../../app/config')
  const restClient = require('../../../app/utils/rest-client')

  jest.mock('../../../app/utils/rest-client')

  const today = new Date().toISOString().slice(0, 10)
  const sbiWithoutSchemes = '208293957'
  const sbiWithSchemes = '106599008'
  const getExistingSchemesUrl = `${config.complianceServiceUrl}/schemes/${sbiWithSchemes}?date=${today}`
  const getExistingSchemesResponse = {
    res: {
      statusCode: 200
    },
    payload: {
      items: [
        {
          sbi: sbiWithSchemes,
          schemeId: 's1',
          dateStart: '2017-08-01',
          dateEnd: '2019-01-01'
        }
      ]
    }
  }
  const getNoExistingSchemesUrl = `${config.complianceServiceUrl}/schemes/${sbiWithoutSchemes}?date=${today}`
  const getNoExistingSchemesResponse = {
    res: {
      statusCode: 204
    },
    payload: []
  }

  let createServer
  let server

  beforeAll(async () => {
    createServer = require('../../../app/server')
  })

  beforeEach(async () => {
    restClient.get.mockImplementation(url => {
      switch (url) {
        case getExistingSchemesUrl:
          return getExistingSchemesResponse

        case getNoExistingSchemesUrl:
          return getNoExistingSchemesResponse

        default:
          throw Error('restClient.get was called with an unexpected URL')
      }
    })

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    jest.resetAllMocks()
    await server.stop()
  })

  test('fetches existing schemes data from compliance API', async () => {
    const options = {
      method: 'GET',
      url: `/apply/businesses/${sbiWithSchemes}/eligibility`
    }

    await server.inject(options)
    expect(restClient.get).toHaveBeenCalledWith(getExistingSchemesUrl)
  })

  test('returns 200 with HTML payload if SBI has existing schemes', async () => {
    const options = {
      method: 'GET',
      url: `/apply/businesses/${sbiWithSchemes}/eligibility`
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8')
  })

  test('rejects SBI of length other than 9 characters', async () => {
    const insbiWithSchemess = [
      '12345678',
      '1234567890'
    ]

    for (const insbiWithSchemes of insbiWithSchemess) {
      const options = {
        method: 'GET',
        url: `/apply/businesses/${insbiWithSchemes}`
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    }
  })

  test('rejects SBI containing a non-numeric character', async () => {
    // Note that some symbols are not tested here because they would cause a request to hit a different route: #?/\
    const disallowedCharacters = '!"£$%^&*()-=_+{}[]:@~;\'<>,.|abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (const disallowedCharacter of disallowedCharacters) {
      const insbiWithSchemes = disallowedCharacter.concat(sbiWithSchemes.slice(1))
      const options = {
        method: 'GET',
        url: `/apply/businesses/${insbiWithSchemes}`
      }

      const response = await server.inject(options)

      if (response.statusCode !== 400) {
        console.debug({ disallowedCharacter, insbiWithSchemes, status: response.statusCode })
      }

      expect(response.statusCode).toBe(400)
    }
  })
})
