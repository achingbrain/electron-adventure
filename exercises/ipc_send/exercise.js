const machineId = require('electron-machine-id').machineIdSync
const exercise = require('workshopper-exercise')()
const verifyProcessor = require('../../lib/verify-processor')
const faker = require('faker')
const chat = require('udp-chat-server')

require('../../lib/create-app')(exercise)

const USER_INPUT_FORM_SELECTOR = '[data-id=user-input-form]'
const USERNAME_INPUT_SELECTOR = '[data-id=initial-username-input]'
const AVATAR_INPUT_SELECTOR = '[data-id=initial-avatar-input]'
const BUTTON_SELECTOR = '[data-id=initial-save-button]'
const MESSAGE_INPUT_SELECTOR = '[data-id=text-message-input]'

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  const message = faker.lorem.paragraph()
  const name = faker.name.findName()
  const avatar = faker.image.imageUrl()

  const promise = new Promise((resolve, reject) => {
    chat({
      onMessage: async function ({type, data}) {
        if (type === 'user') {
          return
        }

        const id = machineId()

        try {
          await test.equals(type, 'message', 'event_type')
          await test.truthy(data, 'data_present')
          await test.truthy(data.sender, 'data_sender_present')
          await test.equals(id, data.sender.id, 'machine_id')
          await test.equals(name, data.sender.name, 'user_name', {
            name: name
          })
          await test.equals(avatar, data.sender.avatar, 'user_avatar', {
            avatar: avatar
          })
          await test.truthy(data.message, 'data_message_present')
          await test.equals(data.message.type, 'text', 'message_type', {
            type: data.message.type
          })
          await test.equals(data.message.text, message, 'message_text')

          resolve()
        } catch (error) {
          console.info(error)
          reject(error)
        }
      }
    })
  })

  await exercise.app.client.windowHandles()
  await exercise.app.client.waitUntil(() => exercise.app.client.getWindowCount().then((count) => count === 2))
  await exercise.app.client.windowByIndex(1)
  await exercise.app.client.execute(() => {
    window && window.store && window.store.dispatch({
      type: 'RESET',
      payload: {}
    })
  })

  await test.visible(exercise.app, USERNAME_INPUT_SELECTOR, 'element_visible', {
    element: USERNAME_INPUT_SELECTOR
  })
  await exercise.app.client.setValue(USERNAME_INPUT_SELECTOR, name)

  await test.visible(exercise.app, AVATAR_INPUT_SELECTOR, 'element_visible', {
    element: AVATAR_INPUT_SELECTOR
  })
  await exercise.app.client.setValue(AVATAR_INPUT_SELECTOR, avatar)

  await test.visible(exercise.app, BUTTON_SELECTOR, 'element_visible', {
    element: BUTTON_SELECTOR
  })

  await exercise.app.client.click(BUTTON_SELECTOR)

  await test.notVisible(exercise.app, USER_INPUT_FORM_SELECTOR, 'element_not_visible', {
    element: USER_INPUT_FORM_SELECTOR
  })

  await test.visible(exercise.app, MESSAGE_INPUT_SELECTOR, 'element_visible', {
    element: MESSAGE_INPUT_SELECTOR
  })
  await exercise.app.client.setValue(MESSAGE_INPUT_SELECTOR, message)
  await exercise.app.client.keys('Enter')

  return promise
}))

module.exports = exercise
