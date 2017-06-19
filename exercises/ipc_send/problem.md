# IPC

In a typical Electron app, there are two processes: `main` & `renderer`.

The `main` process is a [node.js](http://www.nodejs.com) process with access to the full node API.

`renderer` on the other hand, is more like a web browser so cannot access the file system, the network (outside of XmlHttpRequest, WebSockets, etc).

These two processes can communicate via Electron's built in [IPC](inter-process-communication) channel.

We are going to listen for UDP broadcasts from the `main` process and pass those messages to the `renderer` for display.

## Prerequisites

If you have not completed the `react` exercise, please clone the repo `achingbrain/electron-adventure-solution` and check out the `ipc-send` tag.

```
$ git clone https://github.com/achingbrain/electron-adventure-solution
$ cd electron-adventure-solution
$ git checkout ipc-send
$ npm i
```

## Sending events to `main`

The `/src/containers/page` module contains an `onMessage` method which is passed as a callback to the `/src/components/message-input` element.  It takes one argument, `message` which is the string the user entered into the text box.

```javascript
class Page extends React.Component {
  onMessage = (message) => {
    // ...do something with message
  }
```

Implement the `onMessage` function so your app uses the `send` method of the `ipcRenderer` module to send a `message` event to the `main` process using a signature `send(type, message)` where type is the string `'message'`.

## Receiving events from `renderer`

Similarly, `main` can use the `on` method from `ipcMain` to receive events.

For example the `main` process can listen for user information from the `renderer` process:

```javascript
// add this to /src/index.js
ipcMain.on('user', (event, data) => {
  // ... do something with event and data
})
```

The `'user'` event is emitted by `/src/containers/user` when the application has details of the current user or when they change.

Add the above event listener to your `/src/index.js` file and store the users' information in the `main` process somewhere.

Also add an event listener for the `message` event sent by `renderer`.  For the moment just have it print out the message with `console.log`.

## Broadcasting

Once the `main` process has the message, we need to broadcast it to the network.

First, install the `udp-chat-server` module:

```sh
$ npm install --save udp-chat-server
```

The API for `udp-chat-server` is like this:

```javascript
import chat from 'udp-chat-server'

const send = chat({
  onMessage: ({type, data}) => {
    // do something with remote, type & data
  }
})

// ... some time later, send a text message
send({
  type: 'text',
  data: {
    id: 'message-id',
    sender: {
      id: 'user-id',
      name: 'username',
      avatar: 'avatar'
    },
    message: 'Hello world'
  }
})
```

Add the chat server to your `main` process (e.g. to `/src/index.js`)

Write some code so that when `ipcMain` receives a `message` event, the `send` function from `udp-chat-server` is called with an argument with the same fields as above.

Populate `data.sender.name` and `data.sender.avatar` with data received by the `main` process from the `'user'` event.

`data.sender.id` should be a unique-but-stable identifier - add the `electron-machine-id` module to your project for this.

`data.id` is the message id and should be reasonably unique. Consider using the `shortid` module.

## Verify

Once you have done this, package your application and verify your steps from the `chatr` directory:

```
$ npm run package
$ electron-adventure verify
```

Don't forget to run `electron-forge package` after each change to your app.

### Hints

* You can import `ipcRenderer` in `/src/containers/page.jsx` like this:

```javascript
// add this to /src/containers/page.jsx
import { ipcRenderer } from 'electron'
```

* You can import `ipcMain` in `/src/index.js` like this:

```javascript
// add this to /src/index.js
import { ipcMain } from 'electron'
```

## References

1. [inter-process-communication](https://en.wikipedia.org/wiki/Inter-process_communication)
1. [contents-send](https://electron.atom.io/docs/api/web-contents/#contentssendchannel-arg1-arg2-)
1. [ipcRenderer](https://electron.atom.io/docs/api/ipc-renderer/)
1. [ipcMain](https://electron.atom.io/docs/api/ipc-main/)
