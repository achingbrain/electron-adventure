const exercise = require('workshopper-exercise')()
const verifyProcessor = require('../../lib/verify-processor')
const faker = require('faker')
const chat = require('udp-chat-server')
const shortid = require('shortid')
const http = require('http')
const url = require('url')
const {
  resetApp,
  loginToApp
} = require('../../lib/utils')

require('../../lib/create-app')(exercise)

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  const fileId = shortid.generate()
  const user = {
    id: shortid.generate(),
    name: faker.name.findName(),
    avatar: faker.image.imageUrl(),
    status: faker.lorem.word()
  }
  let server
  let send

  const promise = new Promise((resolve, reject) => {
    server = http.createServer((request, response) => {
      try {
        const query = url.parse(request.url, true).query

        test.equals(query.file, fileId, 'file_id')

        response.writeHead(302, {
          location: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        })
        response.end()

        resolve()
      } catch (error) {
        reject(error)
      }
    })
    server.on('clientError', (error, socket) => {
      if (error) {
        console.error(error)
      }

      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    })
    server.listen()

    send = chat({
      onMessage: async function ({type, data}) {

      }
    })
  })

  await resetApp(exercise, test)
  await loginToApp(exercise, test, faker.name.findName(), faker.image.imageUrl())

  const message = {
    id: fileId,
    type: 'file',
    name: faker.system.commonFileName(),
    mimeType: faker.system.mimeType(),
    size: faker.random.number(),
    url: `http://localhost:${server.address().port}?file=${fileId}`
  }

  send({
    type: 'user',
    data: {
      sender: user
    }
  })

  send({
    type: 'message',
    data: {
      message: message,
      sender: user
    }
  })

  const FILE_LINK_SELECTOR = `[data-message-id='${message.id}'] a`

  await test.visible(exercise.app, FILE_LINK_SELECTOR, 'element_visible', {
    element: FILE_LINK_SELECTOR
  })

  await exercise.app.client.click(FILE_LINK_SELECTOR)

  await promise
}))

module.exports = exercise
