const verifyProcessor = require('workshopper-verify-processor')

verifyProcessor.assertions = Object.assign({}, verifyProcessor.assertions, {
  notVisible: async (app, selector) => {
    const elements = await app.client.elements(selector).then(result => result.value)

    if (elements.length) {
      return !await app.client.isVisible(selector)
    }

    return true
  },
  visible: async (app, selector) => {
    const elements = await app.client.elements(selector).then(result => result.value)

    if (!elements.length) {
      return true
    }

    return app.client.isVisible(selector)
  }
})

module.exports = verifyProcessor
