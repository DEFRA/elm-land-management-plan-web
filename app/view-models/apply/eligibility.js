const formatDate = require('../../utils/format-date')

function getBusinessViewModel ({ business: { name, sbi }, existingSchemes }) {
  const existingSchemesTableDefinition = existingSchemes.length === 0 ? undefined : {
    caption: 'Your existing schemes',
    firstCellIsHeader: false,
    head: [
      { text: 'Scheme ID' },
      { text: 'Start date' },
      { text: 'End date' }
    ],
    rows: existingSchemes.map(agreement => ([
      { text: agreement.schemeId },
      { text: formatDate(new Date(agreement.dateStart)) },
      { text: formatDate(new Date(agreement.dateEnd)) }
    ]))
  }

  return {
    business: {
      name,
      sbi
    },
    hasExistingScheme: existingSchemes.length > 0,
    existingSchemesTableDefinition
  }
}

module.exports = getBusinessViewModel
