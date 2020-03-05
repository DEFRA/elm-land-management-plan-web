function ViewModel (accessible, error) {
  // Constructor function to create logic dependent nunjucks page
  this.model = {
    classes: 'govuk-radios--inline',
    idPrefix: 'accessible',
    name: 'accessible',
    fieldset: {
      legend: {
        text: 'Is the property still accessible?',
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--xl'
      }
    },
    hint: {
      text: 'You must be able to access the property safely.'
    },
    items: [
      {
        value: true,
        text: 'Yes'
      },
      {
        value: false,
        text: 'No'
      }
    ]
  }

  if (accessible != null) {
    const item = this.model.items.find(x => x.value === accessible)
    if (item != null) {
      item.checked = true
    }
  }

  // If error is passed to model then this error property is added to the model and therefore radio macro
  if (error) {
    this.model.errorMessage = {
      text: 'Please select if the property is accessible'
    }
  }
}

module.exports = ViewModel
