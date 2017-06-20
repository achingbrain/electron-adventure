const exercise = require('workshopper-exercise')()
const verifyProcessor = require('../../lib/verify-processor')
const faker = require('faker')
const {
  resetApp,
  loginToApp
} = require('../../lib/utils')

require('../../lib/create-app')(exercise)

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  await resetApp(exercise, test)
  await loginToApp(exercise, test, faker.name.findName(), faker.image.imageUrl())
}))

module.exports = exercise
