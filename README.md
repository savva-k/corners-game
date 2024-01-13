# Corners game

<img src="./screenshots/game.png" width="550">

A simple game played on a chess board with checkers pieces and its own 
rules. The idea is to put your pieces to the opponent's home position and be the first one to do that.

## Required software

* Docker or Podman

## Dev environment

// TODO: update docker + docker-compose files after migrating to Java + Quarkus

In the parent folder (`corners-game`):

`docker-compose -f docker-compose.override.yaml up` to start frontend and backend

## Build and run production images

`docker-compose -f docker-compose.prod.yaml up --build` 

### Running in dev mode:

The following commands need `yarn` and `quarkus`:

`quarkus dev` to start the server in the development mode

`yarn start` to start the GUI
