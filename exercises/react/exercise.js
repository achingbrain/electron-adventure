const exercise = require('workshopper-exercise')()
const verifyProcessor = require('../../lib/verify-processor')

require('../../lib/create-app')(exercise)

const BUTTON_SELECTOR = '#my-first-button'
const TEXT_SELECTOR = '#my-first-text'

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  await exercise.app.client.windowHandles()
  await exercise.app.client.waitUntil(() => exercise.app.client.getWindowCount().then((count) => count === 2))
  await exercise.app.client.windowByIndex(1)

  await test.notEmpty(exercise.app.client.elements(BUTTON_SELECTOR).then(result => result.value), 'element_present', {
    element: BUTTON_SELECTOR
  })

  await test.notVisible(exercise.app, TEXT_SELECTOR, 'element_not_visible', {
    element: TEXT_SELECTOR
  })

  await exercise.app.client.click(BUTTON_SELECTOR)

  await test.visible(exercise.app, TEXT_SELECTOR, 'element_visible', {
    element: TEXT_SELECTOR
  })

  await test.equals(exercise.i18n('expected_text'), exercise.app.client.getText(TEXT_SELECTOR), 'element_contained_text', {
    element: TEXT_SELECTOR,
    text: exercise.i18n('expected_text')
  })
}))

module.exports = exercise
