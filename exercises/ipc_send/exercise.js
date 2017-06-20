const machineId = require('electron-machine-id').machineIdSync
const exercise = require('workshopper-exercise')()
const verifyProcessor = require('../../lib/verify-processor')
const faker = require('faker')
const chat = require('udp-chat-server')
const {
  resetApp,
  loginToApp
} = require('../../lib/utils')

require('../../lib/create-app')(exercise)

const {
  MESSAGE_INPUT_SELECTOR
} = require('../../lib/selectors')

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

  await resetApp(exercise, test)
  await loginToApp(exercise, test, name, avatar)

  await test.visible(exercise.app, MESSAGE_INPUT_SELECTOR, 'element_visible', {
    element: MESSAGE_INPUT_SELECTOR
  })
  await exercise.app.client.setValue(MESSAGE_INPUT_SELECTOR, message)
  await exercise.app.client.keys('Enter')

  await promise
}))

module.exports = exercise
