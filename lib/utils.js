
const {
  USER_INPUT_FORM_SELECTOR,
  USERNAME_INPUT_SELECTOR,
  AVATAR_INPUT_SELECTOR,
  BUTTON_SELECTOR
} = require('./selectors')

const resetApp = async function (exercise, test) {
  await exercise.app.client.windowHandles()
  await exercise.app.client.waitUntil(() => exercise.app.client.getWindowCount().then((count) => count === 2))
  await exercise.app.client.windowByIndex(1)
  await exercise.app.client.execute(() => {
    const localforage = require('localforage')
    const resetRedux = () => {
      return localforage.clear()
        .then(() => {
          return new Promise((resolve, reject) => {
            const resetStore = () => {
              if (!store || !store.dispatch) {
                setTimeout(resetStore, 100)
              }

              try {
                store.dispatch({
                  type: 'RESET'
                })

                resolve()
              } catch (error) {
                reject(error)
              }
            }

            resetStore()
          })
        })
        .then(() => {
          const state = store.getState()

          if (state.user.name || !state.message.length) {
            return resetRedux()
          }
        })
    }

    resetRedux()
  })
}

const loginToApp = async function (exercise, test, name, avatar) {
  await exercise.app.client.waitForVisible(USERNAME_INPUT_SELECTOR, 5000)
  await test.visible(exercise.app, USERNAME_INPUT_SELECTOR, 'element_visible', {
    element: USERNAME_INPUT_SELECTOR
  })
  await exercise.app.client.setValue(USERNAME_INPUT_SELECTOR, name)

  await exercise.app.client.waitForVisible(AVATAR_INPUT_SELECTOR, 5000)
  await test.visible(exercise.app, AVATAR_INPUT_SELECTOR, 'element_visible', {
    element: AVATAR_INPUT_SELECTOR
  })
  await exercise.app.client.setValue(AVATAR_INPUT_SELECTOR, avatar)

  await exercise.app.client.waitForVisible(BUTTON_SELECTOR, 5000)
  await test.visible(exercise.app, BUTTON_SELECTOR, 'element_visible', {
    element: BUTTON_SELECTOR
  })
  await exercise.app.client.click(BUTTON_SELECTOR)

  await exercise.app.client.waitForVisible(USER_INPUT_FORM_SELECTOR, 5000, true)
  await test.notVisible(exercise.app, USER_INPUT_FORM_SELECTOR, 'element_not_visible', {
    element: USER_INPUT_FORM_SELECTOR
  })
}

module.exports = {
  resetApp,
  loginToApp
}
