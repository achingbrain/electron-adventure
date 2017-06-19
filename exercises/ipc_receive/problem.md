# IPC

In a typical Electron app, there are two processes: `main` & `renderer`.

The `main` process is a [node.js](http://www.nodejs.com) process with access to the full node API.

`renderer` on the other hand, is more like a web browser so cannot access the file system, the network (outside of XmlHttpRequest, WebSockets, etc).

These two processes can communicate via Electron's built in [IPC](inter-process-communication) channel.

We are going to listen for UDP broadcasts from the `main` process and pass those messages to the `renderer` for display.

## Prerequisites

If you have not completed the `react` exercise, please clone the repo `achingbrain/electron-adventure-solution` and check out the `ipc-receive` tag.

```
$ git clone https://github.com/achingbrain/electron-adventure-solution
$ cd electron-adventure-solution
$ git checkout ipc-receive
$ npm i
```


## Receiving messages

## Adding udp-chat-server to `main`

1.  Broadcasting messages




Your app should use the ipcMain module to listen to events

1.  Sending messages to the `renderer`

In the `onMessage` callback, your app should use [`contents.send`](contents-send) on `mainWindow.webContents` to send events from the `main` process to the `renderer` using the signature `send(type, data)`.




Once you have done this, package your application and verify your steps:

```
$ npm run package
$ electron-adventure verify /path/to/my-first-app/out/my-first-app-darwin-x64/my-first-app.app/Contents/MacOS/my-first-app
```

Don't forget to run `electron-forge package` after each change to your app.
