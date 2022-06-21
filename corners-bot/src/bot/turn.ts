import { Game, Piece } from "corners-common/dist/model";
import { getAvailableMoves, getPiecesOfColor } from "corners-common/dist/services";
import { whiteStartPositions, blackStartPositions } from "corners-common/dist/constants"

const jumpCloserToWinningPosition = (game: Game, pieceColor: Piece) => {
    const playersPieces = getPiecesOfColor(game.field, pieceColor);

    for (let i = 0; i < playersPieces.length; i++) {
        let randomPiece = getRandomElement(playersPieces);
        while (isInHomePosition(randomPiece, pieceColor)) {
            randomPiece = getRandomElement(playersPieces);
        }
        const availableMoves = getAvailableMoves(game, randomPiece);
        if (availableMoves.length > 0) {
            return [randomPiece, getPositionCloserToHome(availableMoves, pieceColor)];
        }
    }

    return [];
}

const getRandomElement = (arr: string[]) => {
    return arr[Math.floor((Math.random()*arr.length))];
}

const getPositionCloserToHome = (arr: string[], pieceColor: Piece) => {
    arr.sort(pieceColor === Piece.White ? sortForWhite : sortForBlack); 
    console.log(`${pieceColor}: ${arr}`)
    return arr[arr.length-1];
}

const isInHomePosition = (position: string, pieceColor: Piece) => {
    return pieceColor === Piece.White ? blackStartPositions.includes(position) : whiteStartPositions.includes(position);
}

const sortForWhite = (a: string, b: string) => {
    if (a === b) return 0;
    if (a[0] > b[0] && a[1] > b[1]) return 1;
    if (a[0] > b[0] || a[1] > b[1]) return 1;
    return -1;
}

const sortForBlack = (a: string, b: string) => {
    if (a === b) return 0;
    if (a[0] < b[0] && a[1] < b[1]) return 1;
    if (a[0] < b[0] || a[1] < b[1]) return 1;
    return -1;
}

export default { 
    jumpCloserToWinningPosition
}
