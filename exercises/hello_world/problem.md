# Hello world

First we're going to install electron-forge which we'll use to build our first app.

```
$ npm install -g electron-forge
```

Then init your app, install `electron-prebuilt-compile` and start it:

```
$ electron-forge init my-first-app
$ cd my-first-app
$ npm install electron-prebuilt-compile@1.6.11 --save-dev
$ electron-forge start
```

This should start the basic app and display `Well hey there!!!` in a window.

To finish this exercise, open `/src/index.html` and create a button with the id 'my-first-button' which when clicked shows the text 'Electron is great' in an element with the id 'my-first-text'.

Once you have done this, build your application and verify your steps:

```
$ electron-forge package
$ electron-adventure verify /path/to/my-first-app/out/my-first-app-darwin-x64/my-first-app.app/Contents/MacOS/my-first-app
```

Don't forget to run `electron-forge package` after each change to your app.

## References

1. [electron-forge](https://www.npmjs.com/package/electron-forge)
