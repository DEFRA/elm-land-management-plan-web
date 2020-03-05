const hoek = require('@hapi/hoek')

module.exports = {
  get: function (request, key) {
    let object = request.yar.get(key)
    if (object == null) {
      console.log(`no cached value for ${key}`)
      object = {}
    }
    return object
  },
  set: function (request, key, value) {
    console.log(`setting cached value for ${key}`)
    request.yar.set(key, value)
  },
  update: function (request, key, object) {
    const existing = this.get(request, key)
    hoek.merge(existing, object, true, false)
    this.set(request, key, existing)
  },
  clear: function (request, key) {
    console.log(`clearing cached value for ${key}`)
    request.yar.clear(key)
  }
}
