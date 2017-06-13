# React

Electron does not have an opinion when it comes to UI frameworks or languages.  This is good because it can be a general container for whatever UI rendering technology your team wishes to use.

We are going to add support for ES6, React & LESS to our app.

First install `electron-prebuilt-compile` and save it as a dev dependency.

```
$ npm install --save-dev electron-prebuilt-compile
```

Then install `react` and friends:

```
$ npm install --save react react-dom prop-types react-redux react-router-redux react-router ace-css
```

Update your `index.html` to look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>My first app</title>
    <link rel='stylesheet' type='text/less' href='main.less' />
  </head>
  <body class='m0 bg-white'>
    <div id='app-root'></div>
    <script src='main.jsx'></script>
  </body>
</html>
```

Next, create the `main.less` and `main.jsx` files

```less
// main.less
@import (css, inline) 'ace-css/css/ace.css';
```

```js
// main.jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/root'

ReactDOM.render(<Root store={store} history={history} />, document.getElementById('app-root'))
```





```
$ electron-forge init my-first-app
$ cd my-first-app
$ npm run start
```

This should start the basic app and display `Well hey there!!!` in a window.

To finish this exercise, open `/src/index.html` and create a button with the id 'my-first-button' which when clicked shows the text 'Electron is great' in an element with the id 'my-first-text'.

Once you have done this, package your application and verify your steps:

```
$ npm run package
$ electron-adventure verify /path/to/my-first-app/out/my-first-app-darwin-x64/my-first-app.app/Contents/MacOS/my-first-app
```

Don't forget to run `electron-forge package` after each change to your app.

## Hints

* Use simple DOM methods to show the button, no framework required

## References

1. [electron-forge](https://www.npmjs.com/package/electron-forge)
