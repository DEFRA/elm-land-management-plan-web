describe('getEligibilityViewModel', () => {
  const getEligibilityViewModel = require('../../../app/view-models/apply/eligibility')

  const business = {
    name: 'High farm',
    sbi: '107302137'
  }
  const existingSchemes = [
    { schemeId: 's1', dateStart: '2020-01-01T00:00:00', dateEnd: '2030-01-01T00:00:00' },
    { schemeId: 's2', dateStart: '2018-08-01T00:00:00', dateEnd: '2020-08-01T00:00:00' }
  ]

  test('returns an object as the view model', () => {
    const result = getEligibilityViewModel({ business, existingSchemes })

    expect(typeof result).toBe('object')
  })

  test('includes the provided business details', () => {
    const result = getEligibilityViewModel({ business, existingSchemes })

    expect(result.business).toEqual(business)
  })

  test('indicates that the business has existing schemes if schemes are provided', () => {
    const result = getEligibilityViewModel({ business, existingSchemes })

    expect(result.hasExistingScheme).toEqual(true)
  })

  test('indicates that the business does not have existing schemes if no schemes are provided', () => {
    const result = getEligibilityViewModel({ business, existingSchemes: [] })

    expect(result.hasExistingScheme).toEqual(false)
  })

  test('includes an existing schemes table if schemes are provided', () => {
    const result = getEligibilityViewModel({ business, existingSchemes })

    const expectedParcelsTable = {
      caption: 'Your existing schemes',
      firstCellIsHeader: false,
      head: [
        { text: 'Scheme ID' },
        { text: 'Start date' },
        { text: 'End date' }
      ],
      rows: [
        [{ text: 's1' }, { text: '1/1/2020' }, { text: '1/1/2030' }],
        [{ text: 's2' }, { text: '1/8/2018' }, { text: '1/8/2020' }]
      ]
    }

    expect(result.existingSchemesTableDefinition).toEqual(expectedParcelsTable)
  })

  test('excludes the existing schemes table if no schemes are provided', () => {
    const result = getEligibilityViewModel({ business, existingSchemes: [] })
    expect(result.schemesTableDefinition).toEqual(undefined)
  })
})
