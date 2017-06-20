# Files

We're going to add the ability to share files to our chat app.

The `renderer` process cannot access the filesystem but the `main` process can, so we'll use that to serve the files.

## Prerequisites

If you have not completed the `ipc_receive` exercise, please clone the repo `achingbrain/electron-adventure-solution` and check out the `files` tag.

```
$ git clone https://github.com/achingbrain/electron-adventure-solution
$ cd electron-adventure-solution
$ git checkout files
$ npm i
```

## File sender

Add a file input to the form returned by the `render` method of `/src/components/message-input` after the text message input:

```html
<input className='h1 btn bg-lime olive flex-none' style={{width: 150}} type='file' onChange={this.onSendFile} ref={ref => this.fileInput = ref} />
```

Implement the `onSendFile` method of `/src/components/message-input` to call `this.props.onSendFile` with a list of selected files as the first argument.  Each file passed to `this.props.onSendFile` should have the properties:

```javascript
{
  name: String,
  path: String,
  size: Number,
  mimeType: String
}
```

Edit the `onSendFile` method of `/src/components/page` to send a `file` event via the `ipcRenderer` module.

## Serving files

We're going to use the `main` process to serve files.  To do this, create a basic http server:

```javascript
import http from 'http'
import fs from 'fs'
import url from 'url'

let files = {}

// serve files from, for example, http://localhost:${port}?file=${id}
const server = http.createServer((request, response) => {
  const query = url.parse(request.url, true).query
  const file = files[query.file]

  if (!file) {
    response.writeHead(404)
    response.end()
    return
  }

  response.writeHead(200, {
    'Content-Type': file.type,
    'Content-Length': file.size
  })

  fs.createReadStream(file.path).pipe(response)
})
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})
server.listen()
```

Implement the `ipcMain` listener for `file` events:

```javascript
ipcMain.on('file', (event, chosenFiles) => {
  // some code here
})
```

Your listener should generate an id for the file message and store the file metadata in the `files` object used by the the `http` server above.  It should also send the `file` message via `udp-chat-server` with the following fields:

```javascript
send({
  type: 'message',
  data: {
    message: {
      id: /* a message id */,
      type: 'file',
      name: /* the file name */,
      mimeType: /* the file mime type */,
      size: /* the file size */,
      url: /* a url that your http server will serve the file from */
    },
    sender: user
  }
})
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

* You can find out which port the server is listening on with `server.address().port`
* Store your files in `file` indexed by their id
* Don't accept the path to the file as an argument to your `http` server unless you wish to allow arbitrary access to your file system(!)
* If your redux store becomes unusable, you can reset it from the settings page
