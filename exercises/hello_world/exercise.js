const exercise = require('workshopper-exercise')()
const Application = require('spectron').Application
const path = require('path')
const assert = require('assert')

exercise.addProcessor(function (mode, callback) {
  const appPath = path.resolve(process.cwd(), this.args[0])
  let result = false

  const app = new Application({
    path: appPath
  })
  app.start()
  .then(() => app.client.getWindowCount())
  .then((count) => {
    assert.equal(count, 1, `Had wrong number of windows, expected 1, got ${count}`)
    exercise.emit('pass', 'Had right number of windows')
  })
  .then(() => {
    result = true
  })
  .catch(error => {
    exercise.emit('fail', error)
  })
  .then(() => {
    if (app.isRunning()) {
      // does not seem to actually stop the app :(
      return app.stop()
    }
  })
  .then(() => {
    callback(null, result)
  })
})

module.exports = exercise
