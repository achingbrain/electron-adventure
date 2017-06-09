const chalk = require('chalk')

const TestError = function (message) {
  Error.call(this, message)
}

TestError.prototype = Error.prototype

module.exports = (exercise, verify) => {
  const assert = (fn, message, context) => {
    if (fn()) {
      console.info(' ', chalk.green('✓'), exercise.i18n(`pass.${message}`, context))

      return
    }

    console.error(' ', chalk.red('✗'), exercise.i18n(`fail.${message}`, context))

    throw new TestError(exercise.i18n(`fail.${message}`, context))
  }

  const assertions = {}

  // if any args passed to our verifications are promises, resolve them before continuing
  for (var key in module.exports.assertions) {
    assertions[key] = async function () {
      // resolve any passed promises
      const args = await Promise.all(arguments)

      // this is the function that will do some verification
      const verify = args.shift()

      // it expects this many args
      const expected = verify.length

      const verificationArgs = args.slice(0, expected)

      return assert(verify.bind(null, ...verificationArgs), args[expected], args[expected + 1])
    }.bind(null, module.exports.assertions[key])
  }

  return async (callback) => {
    try {
      console.info(' Verifying...')
      console.info('')
      await verify(assertions)

      console.info('')
      console.info(' All assertions passed')
      console.info('')

      callback(null, true)
    } catch (error) {
      if (error instanceof TestError) {
        console.info('')
        console.info(' There were test failures 😞')
        console.info('')
        console.info(error)

        // assertion failure
        callback(null, false)
      } else {
        // other failure
        console.error(error.stack ? error.stack : error.toString())
        callback(error)
      }
    }
  }
}

// assertions are invoked with function (...args, message, context) where
// ...args are defined as named parameters in the functions below
module.exports.assertions = {
  equals: (left, right) => left === right,
  truthy: (left) => !!left,
  falsey: (left) => !left,
  isA: (left, right) => left instanceof right,
  closeTo: (left, right, factor) => Math.abs(left - right) <= factor,
  greaterThan: (left, right) => left > right,
  lessThan: (left, right) => left < right,
  empty: (left) => !left.length,
  notEmpty: (left) => !!left.length
}
