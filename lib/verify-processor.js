const TestError = function (message) {
  Error.call(this, message)
}

TestError.prototype = Error.prototype

module.exports = (exercise, verify) => {
  const assert = (message, context, fn) => {
    if (fn()) {
      exercise.emit('pass', exercise.i18n(`pass.${message}`, context))
    } else {
      exercise.emit('fail', exercise.i18n(`fail.${message}`, context))

      throw new TestError('Failed!')
    }
  }

  var test = {
    equals: (left, right, message, context) => assert(message, context, () => left === right),
    truthy: (left, message, context) => assert(message, context, () => !!left),
    falsey: (left, message, context) => assert(message, context, () => !left),
    isA: (left, right, message, context) => assert(message, context, () => left instanceof right),
    closeTo: (left, right, factor, message, context) => assert(message, context, () => Math.abs(left - right) <= factor),
    greaterThan: (left, right, message, context) => assert(message, context, () => left > right),
    lessThan: (left, right, message, context) => assert(message, context, () => left < right),
    empty: (left, message, context) => assert(message, context, () => !left.length),
    notEmpty: (left, message, context) => assert(message, context, () => !!left.length)
  }

  const resolve = (error, callback) => {
    if (error) {
      if (error instanceof TestError) {
        // assertion failure
        callback(null, false)
      } else {
        // other failure
        console.error(error.stack ? error.stack : error.toString())
        callback(error)
      }
    } else {
      callback(null, true)
    }
  }

  return async (callback) => {
    try {
      await verify(test, (error) => {
        resolve(error, callback)
      })
    } catch (error) {
      resolve(error, callback)
    }
  }
}
