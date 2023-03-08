# Pie Chart Generator

## Install Node and npm
No instructions available

## Install http-server

### Linux/WSL

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
### MacOS
No instructions available

## Launch the App

Navigate to the Pie_Chart_Generator folder:
```bash
$ pwd
Java_Game/Pie_Chart_Generator
```

Run the `http-server` command:
```bash
$ http-server
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://172.28.27.58:8080
Hit CTRL-C to stop the server
```