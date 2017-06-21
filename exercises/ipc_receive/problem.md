# IPC part II

Now that we are sending messages into the ether it's time to start displaying them to the user.

## Prerequisites

If you have not completed the `ipc-receive` exercise, please clone the repo `achingbrain/electron-adventure-solution` and check out `ipc-receive`.

```
$ git clone https://github.com/achingbrain/electron-adventure-solution
$ cd electron-adventure-solution
$ git checkout ipc-receive
$ npm i
```

## Relaying messages from `main` to `renderer`

In `/src/index.js` the `onMessage` callback passed to `udp-chat-server` should use [`contents.send`](contents-send) on `mainWindow.webContents` to send events from the `main` process to the `renderer` using the signature `send(type, data)`.

From the previous exercise, `onMessage` can be implemented like this:

```javascript
import chat from 'udp-chat-server'

const send = chat({
  onMessage: ({type, data}) => {
    // do something with type and data
  }
})
```

## Dispatching messages to the redux store

The component `/src/containers/ipc` is a [Higher-Order Component]([higher-order-components]) that will listen for incoming IPC events and dispatch suitable actions to the redux store.  This will trigger renders which will display messages to the user.

In the `/src/containers/ipc` constructor, implement listeners for `message` and `user` events from [`ipcRenderer`](ipc-renderer) with the listener signature `(event, data) => {}` and call the `addMessage` and `addMember` prop functions, passing the `data` argument to the prop function as the first argument.

## Did we send that message?

The `udp-chat-server` will relay all messages reguardless of source.  If we sent a message, we should render it differently.

Change the `onMessage` callback handed to the `udp-chat-server` module to set `source = true` on incoming messages if the `data.sender.id` property is equal to the value returned from `electron-machine-id`.

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

1. [contents-send](https://electron.atom.io/docs/api/web-contents/#contentssendchannel-arg1-arg2-)
1. [higher-order-components](https://facebook.github.io/react/docs/higher-order-components.html)
1. [ipc-renderer](https://electron.atom.io/docs/api/ipc-renderer/)
