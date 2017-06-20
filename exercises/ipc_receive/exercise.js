const exercise = require('workshopper-exercise')()
const verifyProcessor = require('../../lib/verify-processor')
const faker = require('faker')
const chat = require('udp-chat-server')
const shortid = require('shortid')
const {
  resetApp,
  loginToApp
} = require('../../lib/utils')

require('../../lib/create-app')(exercise)

const {
  MESSAGE_INPUT_SELECTOR,
  CURRENT_USER_MESSAGE_SELECTOR
} = require('../../lib/selectors')

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  // message from current user
  const currentUserMessage = faker.lorem.paragraph()
  const currentUserName = faker.name.findName()
  const currentUserAvatar = faker.image.imageUrl()

  // message from other user
  const otherUserMessage = faker.lorem.paragraph()
  const otherUserName = faker.name.findName()
  const otherUserAvatar = faker.image.imageUrl()
  const otherUserStatus = faker.lorem.word()

  await resetApp(exercise, test)
  await loginToApp(exercise, test, currentUserName, currentUserAvatar)

  const send = chat({
    onMessage: ({type, data}) => {

    }
  })

  await test.visible(exercise.app, MESSAGE_INPUT_SELECTOR, 'element_visible', {
    element: MESSAGE_INPUT_SELECTOR
  })
  await exercise.app.client.setValue(MESSAGE_INPUT_SELECTOR, currentUserMessage)
  await exercise.app.client.keys('Enter')

  await test.visible(exercise.app, CURRENT_USER_MESSAGE_SELECTOR, 'element_visible', {
    element: CURRENT_USER_MESSAGE_SELECTOR
  })

  const otherUser = {
    id: shortid.generate(),
    name: otherUserName,
    avatar: otherUserAvatar,
    status: otherUserStatus
  }

  send({
    type: 'user',
    data: {
      sender: otherUser
    }
  })

  await test.visible(exercise.app, `[data-member-id='${otherUser.id}'][data-member-status='${otherUser.status}']`, 'element_visible', {
    element: `[data-member-id='${otherUser.id}'][data-member-status='${otherUser.status}']`
  })

  const message = {
    id: shortid.generate(),
    sender: otherUser,
    type: 'text',
    text: otherUserMessage
  }

  send({
    type: 'message',
    data: message
  })

  await test.visible(exercise.app, `[data-type=message][data-source=false][data-message-id='${message.id}']`, 'element_visible', {
    element: `[data-type=message][data-source=false][data-message-id='${message.id}']`
  })
}))

module.exports = exercise
