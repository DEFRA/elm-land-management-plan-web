
describe('getBusinessViewModel', () => {
  const getBusinessViewModel = require('../../../app/view-models/apply/business')

  const parcels = [
    { parcelId: 'p1', hectares: 2.43612 },
    { parcelId: 'p2', hectares: 3.87654 },
    { parcelId: 'p3', hectares: 1.19236 },
    { parcelId: 'p4', hectares: 0.91726 },
    { parcelId: 'p5', hectares: 2.12937 }
  ]
  const sbi = 's1'

  test('returns an object as the view model', () => {
    const result = getBusinessViewModel({ parcels, sbi })

    expect(typeof result).toBe('object')
  })

  test('includes the provided SBI in the view model', () => {
    const result = getBusinessViewModel({ parcels, sbi })

    expect(result.business).toEqual({ sbi })
  })

  test('includes a parcel table in the view model, with areas rounded to 4 decimal places', () => {
    const result = getBusinessViewModel({ parcels, sbi })

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
    const result = getBusinessViewModel({ parcels, sbi })

    const expectedSummaryTable = {
      caption: 'Your business',
      firstCellIsHeader: true,
      rows: [
        [{ text: 'SBI' }, { text: sbi }],
        [{ text: 'Total holdings' }, { text: '10.5517 ha' }]
      ]
    }

    expect(result.summaryTableDefinition).toEqual(expectedSummaryTable)
  })
})
