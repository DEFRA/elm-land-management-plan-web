function ViewModel (dateOfSubsidence, error) {
  // Constructor function to create logic dependent nunjucks page
  this.model = {
    id: 'date-of-subsidence',
    fieldset: {
      legend: {
        text: 'When did the subsidence start?',
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--xl'
      }
    },
    hint: {
      text: 'For example, 12 11 2007'
    },
    items: [
      {
        name: 'day',
        classes: 'govuk-input--width-2'
      },
      {
        name: 'month',
        classes: 'govuk-input--width-2'
      },
      {
        name: 'year',
        classes: 'govuk-input--width-4'
      }
    ]
  }

  if (dateOfSubsidence != null) {
    dateOfSubsidence = new Date(dateOfSubsidence)
    this.model.items.find(x => x.name === 'day').value = dateOfSubsidence.getDate()
    this.model.items.find(x => x.name === 'month').value = dateOfSubsidence.getMonth() + 1
    this.model.items.find(x => x.name === 'year').value = dateOfSubsidence.getFullYear()
  }

  // If error is passed to model then this error property is added to the model and therefore radio macro
  if (error) {
    this.model.errorMessage = {
      text: 'Please select a valid date'
    }
  }
}

module.exports = ViewModel
