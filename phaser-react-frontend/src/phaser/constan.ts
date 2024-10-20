type Sprite = {
    width: number,
    height: number,
    image: string,
}

const TOTAL_FILES = 8;
const TOTAL_RANKS = 8;

export const GAME_CONTAINER_ID = 'game-container';

export const GAME_FIELD_OFFSET = 48;

export const SPRITES: Record<string, Sprite> = {
    cell: {
        width: 48,
        height: 48,
        image: 'sprites/base-cell.png',
    }
};

export const GAME_CANVAS_WIDTH = SPRITES.cell.width * TOTAL_FILES + SPRITES.cell.width * 2;
export const GAME_CANVAS_HEIGHT = SPRITES.cell.height * TOTAL_RANKS + SPRITES.cell.height * 2;
