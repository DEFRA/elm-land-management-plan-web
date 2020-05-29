module.exports = {
  method: 'POST',
  path: '/apply/sign-in-submit',
  options: {
    handler: async (request, h) => h.redirect('/apply/businesses')
  }
}
