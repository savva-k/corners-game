import { Piece } from "corners-common/dist/model/Piece";
import botTurn from "./bot/turn";
import bot from "./bot";
import { Game } from "corners-common/dist/model/Game";

const p1 = "John Doe";
const p2 = "Jane Doe";

const makeTurn = (
  game: Game,
  pieceColor: Piece,
  originalMakeTurn: (gameId: string, current: string, desired: string) => void
) => {
  const availableMoves = botTurn.justJumpSomewhere(game, pieceColor);
  if (availableMoves.length === 2) {
    originalMakeTurn(game.id, availableMoves[0], availableMoves[1]);
  } else {
    console.log("I cant move!");
  }
};

let bot1 = bot();
let bot2 = bot();

bot1.onGameCreated((game) => bot2.joinGame(game.id));
bot1.onGameUpdated(
  (game) =>
    game.currentTurn === Piece.White &&
    setTimeout(() => makeTurn(game, Piece.White, bot1.makeTurn), 2000)
);
bot2.onGameUpdated(
  (game) =>
    game.currentTurn === Piece.Black &&
    setTimeout(() => makeTurn(game, Piece.Black, bot2.makeTurn), 2000)
);

bot1.login(p1);
bot2.login(p2);

bot1.createGame();
