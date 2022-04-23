# Corners game

<img src="./screenshots/game.png" width="550">

A simple game played on a chess board with checkers pieces and its own 
rules

## Required software

* Node
* Yarn
* Yalc

## Running for the first time

For the first time, please run `yarn` in the following folders:
* backend
* client
* frontend

Also, run `yalc publish` in the `client` folder and `yalc update corners-game` in the `frontend` folder

## How to run the project

`yarn start` will run a server and a frontend instances

### Note

The `corners-client` module is currently linked using `yalc`. To apply changes in that module, run `yalc publish` in the `client` folder

To use the latest version of the `corners-clients` module, run `yalc update corners-client` in a dependent project
