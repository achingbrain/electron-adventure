const Application = require('spectron').Application
const appPath = require('./app-path')

module.exports = (exercise) => {
  exercise.addSetup(async (mode, callback) => {
    exercise.app = new Application({
      path: appPath()
    })

    await exercise.app.start()

    callback()
  })

  exercise.addCleanup(async (mode, passed, callback) => {
    if (exercise.app && exercise.app.isRunning()) {
      await exercise.app.stop()
    }

    callback()
  })
}
