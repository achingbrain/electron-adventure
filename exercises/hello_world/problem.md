# Hello world

We're going to build `chatr` - a desktop chat app using Electron.

There are lots of competing chat apps in the world, so we're going to develop one that will eclipse them all and become the [one true chat app](never-do-this).

First we're going to install [`electron-forge`](electron-forge) which we'll use to create our application scaffold.

```
$ npm install -g electron-forge
```

Then init your app and start it:

```
$ electron-forge init chatr
$ cd chatr
$ npm run start
```

This should start the basic app and display `Well hey there!!!` in a window.

To finish this exercise, open `/src/index.html` and create a button with the id 'my-first-button' which when clicked shows the text 'Electron is great' in an element with the id 'my-first-text'.

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

* Use simple DOM methods to show the button, no framework required

## References

1. [never-do-this](https://xkcd.com/927/)
1. [electron-forge](https://www.npmjs.com/package/electron-forge)
