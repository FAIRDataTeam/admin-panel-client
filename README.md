# Admin Panel - Client Application

> This is the client for the [Admin Panel Server Application](https://github.com/FAIRDataTeam/admin-panel-server/).

[![Build Status](https://travis-ci.org/FAIRDataTeam/admin-panel-server.svg?branch=master)](https://travis-ci.org/FAIRDataTeam/admin-panel-server.svg?branch=master)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

## Deployment

Admin Panel Client is distributed as a Docker image. The only configuration needed is to provide API url (without the trailing slash) of the server as a `API_URL` env variable when running the docker image.

The application in the image is served on port 80.

```
$ docker run -d -p 8080:80 -e API_URL=http://api.example.com fairdata/admin-panel-client
```

Or if you use [Docker Compose](https://docs.docker.com/compose/):

```
version: '3'
services:
    client:
        image: fairdata/admin-panel-client
        ports:
            - 8080:80
        environment:
            - API_URL=http://api.example.com
```

> You can use a single docker-compose file to deploy both, client and server.


## Development

Install dependencies using:

```
$ npm install
```

Compile and hot-reload for development:

```
npm run serve
```

Compile and minify for production:

```
$ npm run build
```

Run tests or linter:

```
$ npm run test
$ npm run lint
```
