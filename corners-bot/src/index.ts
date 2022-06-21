import { Piece, Game } from "corners-common/dist/model";
import botTurn from "./bot/turn";
import bot from "./bot";

const settings = { host: '127.0.0.1', port: '8080', protocol: 'ws' };

const bot1 = bot("John Doe", Piece.White, settings);
const bot2 = bot("Jane Doe", Piece.Black, settings);

let lastTurn = Piece.Black;

const makeTurn = (
  game: Game,
  pieceColor: Piece,
  originalMakeTurn: (gameId: string, current: string, desired: string) => void,
  e?: boolean
) => {
  const move = botTurn.jumpCloserToWinningPosition(game, pieceColor);


  const currentBot = game.currentTurn === bot1.pieceColor ? bot1 : bot2;
  console.log(`On game ${e ? 'joined' : 'updated'} by ${currentBot.name}`)
  console.log(`${currentBot.name} moves: ${move}`)

  if (move.length === 2) {
    originalMakeTurn(game.id, move[0], move[1]);
  } else {
    console.log("I cant move!");
  }
};


const onGameUpdated = (game: Game, e?: boolean) => {
  const currentBot = game.currentTurn === bot1.pieceColor ? bot1 : bot2;
  if (game.currentTurn === currentBot.pieceColor && !game.isFinished && lastTurn != currentBot.pieceColor) {
    lastTurn = currentBot.pieceColor;
    setTimeout(() => makeTurn(game, currentBot.pieceColor, currentBot.makeTurn, e), 300);
  }
}

bot1.onGameCreated((game) => bot2.joinGame(game.id));
bot1.onSecondPlayerJoined((game) => onGameUpdated(game, true));
bot1.onGameUpdated((game) => onGameUpdated(game));
bot2.onGameUpdated((game) => onGameUpdated(game));

bot1.login();
bot2.login();

bot1.createGame();
