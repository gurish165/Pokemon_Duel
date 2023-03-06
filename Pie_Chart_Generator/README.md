# Pie Chart Generator

## Linux/WSL

### Install Node and npm

### Install http-server
```bash
$ npm install http-server -g
```

If you are running into folder permission issues, do the following:
```bash
$ sudo chown -R $USER /usr/local/lib/node_modules/
$ sudo chown -R $USER /usr/local/bin/
$ sudo chown -R $USER /usr/local/share/
```

If you are running into the [error](https://github.com/http-party/http-server/issues/756),
```bash
...
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
...
```

change the http-server version to 0.12.3:
```bash
$ npm install -g http-server0.12.3
```