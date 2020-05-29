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
      { text: agreement.dateStart },
      { text: agreement.dateEnd }
    ]))
  }

  return {
    business: {
      name,
      sbi
    },
    existingSchemesTableDefinition,
    hasExistingScheme: existingSchemes.length > 0
  }
}

module.exports = getBusinessViewModel
