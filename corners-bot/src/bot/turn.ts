import { Game, Piece } from "corners-common/dist/model";
import { getAvailableMoves, getPiecesOfColor } from "corners-common/dist/services";

const justJumpSomewhere = (game: Game, pieceColor: Piece) => {
    const playersPieces = getPiecesOfColor(game.field, pieceColor);

    for (let i = 0; i < playersPieces.length; i++) {
        const randomPiece = getRandomElement(playersPieces);
        const availableMoves = getAvailableMoves(game, randomPiece);
        if (availableMoves.length > 0) {
            return [randomPiece, getRandomElement(availableMoves)];
        }
    }

    return [];
}

const getRandomElement = (arr: string[]) => {
    return arr[Math.floor((Math.random()*arr.length))];
}

export default { 
    justJumpSomewhere
}
