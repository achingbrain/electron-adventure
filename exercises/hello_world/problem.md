# Hello world

We're going to build a very simple desktop app using Electron.

First we're going to install electron-forge which we'll use to create our application scaffold.

```
$ npm install -g electron-forge
```

Then init your app and start it:

```
$ electron-forge init my-first-app
$ cd my-first-app
$ npm run start
```

This should start the basic app and display `Well hey there!!!` in a window.

To finish this exercise, open `/src/index.html` and create a button with the id 'my-first-button' which when clicked shows the text 'Electron is great' in an element with the id 'my-first-text'.

Once you have done this, package your application and verify your steps from the `my-first-app` directory:

```
$ npm run package
$ electron-adventure verify
```

Don't forget to run `electron-forge package` after each change to your app.

## Hints

* Use simple DOM methods to show the button, no framework required

## References

1. [electron-forge](https://www.npmjs.com/package/electron-forge)
