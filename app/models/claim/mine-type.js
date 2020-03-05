function ViewModel (mineTypes, error) {
  // Constructor function to create logic dependent nunjucks page
  this.model = {
    idPrefix: 'mineType',
    name: 'mineType',
    fieldset: {
      legend: {
        text: 'Which types of mine are affected?',
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--xl'
      }
    },
    hint: {
      text: 'Select all mine types that apply.'
    },
    items: [
      {
        value: 'coal',
        text: 'Coal'
      },
      {
        value: 'iron',
        text: 'Iron'
      },
      {
        value: 'gold',
        text: 'Gold'
      },
      {
        value: 'other',
        text: 'Other'
      }
    ]
  }

  if (mineTypes != null) {
    mineTypes.forEach(mine => {
      const item = this.model.items.find(x => x.value === mine)
      if (item != null) {
        item.checked = true
      }
    })
  }

  // If error is passed to model then this error property is added to the model and therefore radio macro
  if (error) {
    this.model.errorMessage = {
      text: 'Please select mine types'
    }
  }
}

module.exports = ViewModel
