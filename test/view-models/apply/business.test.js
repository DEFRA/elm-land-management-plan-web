describe('getBusinessViewModel', () => {
  const getBusinessViewModel = require('../../../app/view-models/apply/business')

  const business = {
    name: 'High farm',
    sbi: '106599008'
  }
  const existingSchemes = [
    { schemeId: 's1', dateStart: '2020-01-01', dateEnd: '2021-01-01' },
    { schemeId: 's2', dateStart: '2018-08-01', dateEnd: '2020-08-01' }
  ]
  const parcels = [
    { parcelId: 'p1', hectares: 2.43612 },
    { parcelId: 'p2', hectares: 3.87654 },
    { parcelId: 'p3', hectares: 1.19236 },
    { parcelId: 'p4', hectares: 0.91726 },
    { parcelId: 'p5', hectares: 2.12937 }
  ]
  const sbi = business.sbi

  test('returns an object as the view model', () => {
    const result = getBusinessViewModel({ business, existingSchemes, parcels })

    expect(typeof result).toBe('object')
  })

  test('includes the provided business details in the view model', () => {
    const result = getBusinessViewModel({ business, existingSchemes, parcels })

    expect(result.business).toEqual(business)
  })

  test('includes a parcel table in the view model, with areas rounded to 4 decimal places', () => {
    const result = getBusinessViewModel({ business, existingSchemes, parcels })

    const expectedParcelsTable = {
      caption: 'Your land parcels',
      firstCellIsHeader: false,
      head: [
        { text: 'Parcel ID' },
        { text: 'Area (ha)' }
      ],
      rows: [
        [{ text: 'p1' }, { text: '2.4361' }],
        [{ text: 'p2' }, { text: '3.8765' }],
        [{ text: 'p3' }, { text: '1.1924' }],
        [{ text: 'p4' }, { text: '0.9173' }],
        [{ text: 'p5' }, { text: '2.1294' }]
      ]
    }

    expect(result.parcelsTableDefinition).toEqual(expectedParcelsTable)
  })

  test('excludes the parcel table in the view model if no parcels are given', () => {
    const result = getBusinessViewModel({ business, existingSchemes, parcels: [] })
    expect(result.parcelsTableDefinition).toEqual(undefined)
  })

  test('includes a summary table in the view model, with the holding area rounded to 4 decimal places', () => {
    const result = getBusinessViewModel({ business, existingSchemes, parcels })

    const expectedSummaryTable = {
      caption: 'Your business',
      firstCellIsHeader: true,
      rows: [
        [{ text: 'SBI' }, { text: sbi }, { html: '' }],
        [{ text: 'Registered holdings' }, { text: '10.5517 ha' }, { html: '<a class="govuk-link" href="">Change</a>' }],
        [{ text: 'Registered parcels' }, { text: 5 }, { html: '<a class="govuk-link" href="">Change</a>' }]
      ]
    }

    expect(result.summaryTableDefinition).toEqual(expectedSummaryTable)
  })

  test('displays holdings as None in the summary table if the holding area is zero', () => {
    const result = getBusinessViewModel({ business, existingSchemes, parcels: [] })

    const expectedSummaryTable = {
      caption: 'Your business',
      firstCellIsHeader: true,
      rows: [
        [{ text: 'SBI' }, { text: sbi }, { html: '' }],
        [{ text: 'Registered holdings' }, { text: 'None' }, { html: '<a class="govuk-link" href="">Change</a>' }],
        [{ text: 'Registered parcels' }, { text: 0 }, { html: '<a class="govuk-link" href="">Change</a>' }]
      ]
    }

    expect(result.summaryTableDefinition).toEqual(expectedSummaryTable)
  })
})
