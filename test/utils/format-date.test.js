describe('formatDate', () => {
  const formatDate = require('../../app/utils/format-date')

  test('returns British date format string for given Date object', () => {
    const testCases = {
      '2014-01-02': '2/1/2014',
      '2018-01-02': '2/1/2018',
      '2015-12-22': '22/12/2015',
      '2020-03-31': '31/3/2020',
      '2026-02-20': '20/2/2026',
      '2030-11-10': '10/11/2030'
    }

    for (const rawDateString of Object.keys(testCases)) {
      const testDate = new Date(rawDateString)

      const formattedDate = formatDate(testDate)

      expect(formattedDate).toBe(testCases[rawDateString])
    }
  })
})
