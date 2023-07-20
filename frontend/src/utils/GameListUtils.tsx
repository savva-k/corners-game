import { Game } from "../model";

const isOwnGame = (game: Game, userName: string) => {
  return game.player1?.name === userName || game.player2?.name === userName;
}

const isGamePending = (game: Game, userName: string) => {
  return (!game.player1 || !game.player2) && game.player1?.name !== userName && game.player2?.name !== userName;
}

const isJoinableGame = (game: Game, userName: string) => !isOwnGame(game, userName) && isGamePending(game, userName);

export { isGamePending, isOwnGame, isJoinableGame };
