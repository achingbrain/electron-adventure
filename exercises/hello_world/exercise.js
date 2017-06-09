const exercise = require('workshopper-exercise')()
const Application = require('spectron').Application
const verifyProcessor = require('../../lib/verify-processor')
const appPath = require('../../lib/app-path')

const BUTTON_SELECTOR = '#my-first-button'
const TEXT_SELECTOR = '#my-first-text'

let app

exercise.addSetup(async (mode, callback) => {
  app = new Application({
    path: appPath()
  })

  await app.start()

  callback()
})

exercise.addCleanup(async (mode, passed, callback) => {
  if (app && app.isRunning()) {
    await app.stop()
  }

  callback()
})

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  await app.client.windowHandles()
  await app.client.waitUntil(() => app.client.getWindowCount().then((count) => count === 2))
  await app.client.windowByIndex(1)

  await test.notEmpty(app.client.elements(BUTTON_SELECTOR).then(result => result.value), 'element_present', {
    element: BUTTON_SELECTOR
  })

  const elements = await app.client.elements(TEXT_SELECTOR).then(result => result.value)

  if (elements.length) {
    await test.falsey(app.client.isVisible(TEXT_SELECTOR), 'element_not_visible', {
      element: TEXT_SELECTOR
    })
  }

  await app.client.click(BUTTON_SELECTOR)

  await test.truthy(app.client.isVisible(TEXT_SELECTOR), 'element_visible', {
    element: TEXT_SELECTOR
  })

  await test.equals(exercise.i18n('expected_text'), app.client.getText(TEXT_SELECTOR), 'element_contained_text', {
    element: TEXT_SELECTOR,
    text: exercise.i18n('expected_text')
  })
}))

module.exports = exercise
