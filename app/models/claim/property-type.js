function ViewModel (propertyType, error) {
  // Constructor function to create logic dependent nunjucks page
  this.model = {
    classes: 'govuk-radios--inline',
    idPrefix: 'propertyType',
    name: 'propertyType',
    fieldset: {
      legend: {
        text: 'Which type of property are you claiming on?',
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--xl'
      }
    },
    hint: {
      text: 'Select which best describes the affected property.'
    },
    items: [
      {
        value: 'home',
        text: 'Home'
      },
      {
        value: 'business',
        text: 'Business'
      }
    ]
  }

  if (propertyType != null) {
    const item = this.model.items.find(x => x.value === propertyType)
    if (item != null) {
      item.checked = true
    }
  }

  // If error is passed to model then this error property is added to the model and therefore radio macro
  if (error) {
    this.model.errorMessage = {
      text: 'Please select a property type'
    }
  }
}

module.exports = ViewModel
