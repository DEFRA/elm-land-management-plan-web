function ViewModel (email, error) {
  // Constructor function to create logic dependent nunjucks page
  this.model = {
    label: {
      text: 'Email'
    },
    classes: 'govuk-input--width-20',
    id: 'email',
    name: 'email',
    type: 'email'
  }

  if (email != null) {
    this.model.value = email
  }

  // If error is passed to model then this error property is added to the model and therefore radio macro
  if (error) {
    this.model.errorMessage = {
      text: 'Please enter valid email'
    }
  }
}

module.exports = ViewModel
