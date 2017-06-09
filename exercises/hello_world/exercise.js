const exercise = require('workshopper-exercise')()
const Application = require('spectron').Application
const path = require('path')
const verifyProcessor = require('../../lib/verify-processor')

const BUTTON_SELECTOR = '#my-first-button'
const TEXT_SELECTOR = '#my-first-text'
const TEXT = 'Electron is greats'

let app

exercise.addSetup(async (mode, callback) => {
  const appPath = path.resolve(process.cwd(), exercise.args[0])

  app = new Application({
    path: appPath
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

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test, done) => {
  // if the dev tools are open, windowCount will be 2
  const windowCount = await app.client.getWindowCount()
  // so select the main window
  await app.client.windowByIndex(windowCount === 2 ? 1 : 0)

  const buttonList = await app.client.elements(TEXT_SELECTOR)

  test.notEmpty(buttonList, 'element_present', {
    element: BUTTON_SELECTOR
  })

  const textList = await app.client.elements(TEXT_SELECTOR)

  test.empty(textList, 'element_not_present', {
    element: TEXT_SELECTOR
  })

  await app.client.click(BUTTON_SELECTOR)
  await app.client.waitForExist(TEXT_SELECTOR)
  const text = await app.client.getText(TEXT_SELECTOR)

  test.equals(TEXT, text, 'element_contained_text', {
    element: TEXT_SELECTOR,
    text: TEXT
  })

  done()
}))

module.exports = exercise
