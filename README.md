# Websocket-service

## Description

🖨️ Websocket client service, in charge of listening price updates

### Directory Structure:

- **common/config**: Houses system configuration settings aimed at ensuring robust and reliable code.
- **controllers**: Contains public endpoints for retrieving information about instruments.
- **db**: Handles the connection to the MongoDB database.
- **dto**: Contains data transfer objects (DTOs) defining the types required for various functions.
- **services**: Contains the business logic for operating on entities, specifically instruments and quotes.
- **ws**: Holds the implementation for WebSocket service connections.

### Files:

- **app.module**: Responsible for importing dependencies and setting up the application's dependency injection framework.
- **main.ts**: Serves as the entry point for the application, initializing the NestJS application kernel.

## Requirements

Node Version -> v18.18.2

Yarn version -> 1.22.19

## Usage

To get started, ensure you have Node.js and npm installed on your system. Then, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory and run `yarn install` to install dependencies.
3. Configure your MongoDB connection settings in the `db` directory, if necessary.
4. Start the application by running `yarn start`.
5. Access the provided endpoints to interact with the application.

## Running the app

```bash
# start mongodb docker

$ docker run -d --name candle-db -p 12345:27017 -e MONGO_INITDB_ROOT_USERNAME=traderepublic -e MONGO_INITDB_ROOT_PASSWORD=republictrade mongo

```

## Controllers available

curl --location 'http://localhost:3000/candle/JF2033067165?timestamp=2024-03-29T14%3A45%3A29.871Z'

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Environment Variables

The following variables must be set in the environment if the default value needs to be overridden.

For local environment use the `.env` file which must be included in `.gitignore`. Consider that any system environment variables will take precedence.

Example:

```
PORT="3000"
DATABASE_URL="mongodb://traderepublic:republictrade@0.0.0.0:12345"
DATABASE_PARAMS=""
AWS_REGION="eu-west-1"
INSTRUMENT_WS_URL="ws://localhost:8080/instruments"
QUOTE_WS_URL="ws://localhost:8080/quotes"
```
