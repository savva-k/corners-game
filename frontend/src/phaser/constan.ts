export type Sprite = {
    width: number,
    height: number,
    image: string,
    depth: number,
}

const TOTAL_FILES = 8;
const TOTAL_RANKS = 8;

export const GAME_CONTAINER_ID = 'game-container';

export const GAME_FIELD_OFFSET = 48;

export const FRAME_RATE = 24;

export const BRING_TO_FRONT_DEPTH = 999;


export const GLOBAL_REGISTRY_TRANSLATIONS = 'translations';


export const SPRITES: Record<string, Sprite> = {
    cell: {
        width: 48,
        height: 48,
        image: 'sprites/base-cell.png',
        depth: 1,
    },
    cursor: {
        width: 48,
        height: 48,
        image: 'sprites/cursor.png',
        depth: 2,
    },
    piece_white: {
        width: 48,
        height: 72,
        image: 'sprites/white-piece.png',
        depth: 3,
    },
    piece_black: {
        width: 48,
        height: 72,
        image: 'sprites/black-piece.png',
        depth: 3,
    },
};

export const GAME_CANVAS_WIDTH = SPRITES.cell.width * TOTAL_FILES + SPRITES.cell.width * 2;
export const GAME_CANVAS_HEIGHT = SPRITES.cell.height * TOTAL_RANKS + SPRITES.cell.height * 2;
