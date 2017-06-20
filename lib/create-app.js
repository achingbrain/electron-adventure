const Application = require('spectron').Application
const appPath = require('./app-path')
const exec = require('child_process').exec

module.exports = (exercise) => {
  if (!process.argv.find(arg => arg === '--nobuild')) {
    exercise.addSetup((mode, callback) => {
      console.info(' ')
      console.info(' Building your package...')
      exec('npm run package', (error) => {
        console.info(' Done!')
        console.info(' ')
        callback(error)
      })
    })
  }

  exercise.addSetup(async (mode, callback) => {
    exercise.app = new Application({
      path: appPath(),
      args: [
        'reset'
      ]
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
