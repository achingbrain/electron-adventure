const exercise = require('workshopper-exercise')()
const verifyProcessor = require('../../lib/verify-processor')
const faker = require('faker')

require('../../lib/create-app')(exercise)

const USER_INPUT_FORM_SELECTOR = '[data-id=user-input-form]'
const USERNAME_INPUT_SELECTOR = '[data-id=initial-username-input]'
const AVATAR_INPUT_SELECTOR = '[data-id=initial-avatar-input]'
const BUTTON_SELECTOR = '[data-id=initial-save-button]'

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  await exercise.app.client.windowHandles()
  await exercise.app.client.waitUntil(() => exercise.app.client.getWindowCount().then((count) => count === 2))
  await exercise.app.client.windowByIndex(1)

  await exercise.app.client.execute(() => {
    store && store.dispatch({
      type: 'RESET',
      payload: {}
    })
  })

  await test.visible(exercise.app, USERNAME_INPUT_SELECTOR, 'element_visible', {
    element: USERNAME_INPUT_SELECTOR
  })
  await exercise.app.client.setValue(USERNAME_INPUT_SELECTOR, faker.name.findName())

  await test.visible(exercise.app, AVATAR_INPUT_SELECTOR, 'element_visible', {
    element: AVATAR_INPUT_SELECTOR
  })
  await exercise.app.client.setValue(AVATAR_INPUT_SELECTOR, faker.image.imageUrl())

  await test.visible(exercise.app, BUTTON_SELECTOR, 'element_visible', {
    element: BUTTON_SELECTOR
  })

  await exercise.app.client.click(BUTTON_SELECTOR)

  await test.notVisible(exercise.app, USER_INPUT_FORM_SELECTOR, 'element_not_visible', {
    element: USER_INPUT_FORM_SELECTOR
  })
}))

module.exports = exercise
