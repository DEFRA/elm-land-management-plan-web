describe('getBusinessViewModel', () => {
  const getBusinessViewModel = require('../../../app/view-models/apply/business')

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
  const sbi = 's1'

  test('returns an object as the view model', () => {
    const result = getBusinessViewModel({ existingSchemes, parcels, sbi })

    expect(typeof result).toBe('object')
  })

  test('includes the provided SBI in the view model', () => {
    const result = getBusinessViewModel({ existingSchemes, parcels, sbi })

    expect(result.business).toEqual({ sbi })
  })

  test('includes an existing schemes table in the view model', () => {
    const result = getBusinessViewModel({ existingSchemes, parcels, sbi })

    const expectedParcelsTable = {
      caption: 'Your existing schemes',
      firstCellIsHeader: false,
      head: [
        { text: 'Scheme ID' },
        { text: 'Start date' },
        { text: 'End date' }
      ],
      rows: [
        [{ text: 's1' }, { text: '2020-01-01' }, { text: '2021-01-01' }],
        [{ text: 's2' }, { text: '2018-08-01' }, { text: '2020-08-01' }]
      ]
    }

    expect(result.existingSchemesTableDefinition).toEqual(expectedParcelsTable)
  })

  test('includes a parcel table in the view model, with areas rounded to 4 decimal places', () => {
    const result = getBusinessViewModel({ existingSchemes, parcels, sbi })

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

  test('includes a summary table in the view model, with the holding area rounded to 4 decimal places', () => {
    const result = getBusinessViewModel({ existingSchemes, parcels, sbi })

    const expectedSummaryTable = {
      caption: 'Your business',
      firstCellIsHeader: true,
      rows: [
        [{ text: 'SBI' }, { text: sbi }],
        [{ text: 'Registered holdings' }, { text: '10.5517 ha' }]
      ]
    }

    expect(result.summaryTableDefinition).toEqual(expectedSummaryTable)
  })
})
