# React

We are going to add support for ES6, React & LESS to our app.

Since this is an electron workshopper we're going to use a repo that has already contains the relevant boilerplate.

Clone the repo `achingbrain/electron-adventure-solution` and check out the `react` tag.

```
$ git clone https://github.com/achingbrain/electron-adventure-solution
$ cd electron-adventure-solution
$ git checkout react
$ npm i
```

This should give you the basic react/redux app structure including a store and some dispatchable actions.

We'll need a few more dependencies to make it all work though, so first install [`electron-prebuilt-compile`](electron-prebuilt-compile) and save it as a dev dependency.

```
$ npm install --save-dev electron-prebuilt-compile@1.6.11
```

`electron-prebuilt-compile` natively understands `jsx` and `less` files and will transpile them on the fly for us.  It will throw an error if it is installed as a range instead of a version, hence appending `@1.6.11` above.

Create `/src/index.html`:

```html
<!-- /src/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>Chatr</title>
    <link rel='stylesheet' type='text/less' href='main.less' />
  </head>
  <body class='m0 bg-white'>
    <div id='app-root'></div>
    <script type="application/javascript" src='main.jsx'></script>
  </body>
</html>
```

Then `/src/main.less`:

```less
// /src/main.less
@import (css, inline) '../node_modules/ace-css/css/ace.css';

html, body, #app-root {
  height: 100%
}
```

Finally pull it all together with `/src/main.jsx`:

```js
// /src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/create'
import Page from './containers/page'
import User from './containers/user'
import IPC from './containers/ipc'

const store = configureStore()

ReactDOM.render((
  <Provider store={store}>
    <IPC>
      <User>
        <Page />
      </User>
    </IPC>
  </Provider>
), document.getElementById('app-root'))
```

Now start the app and set your username & avatar:

```
$ npm run start
```

## Verify

Once you have done this verify your steps from the `chatr` directory:

```
$ electron-adventure verify
```

You can skip the build phase by using:

```
$ electron-adventure verify --nobuild
```

Although if you do this you should run `npm run package` first.

## Hints

* If your redux store becomes unusable, you can reset it from the settings page

## References

1. [electron-prebuilt-compile](https://github.com/electron-userland/electron-prebuilt-compile)
2. [never-do-this](https://xkcd.com/927/)
