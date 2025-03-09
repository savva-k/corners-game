export type Sprite = {
    width: number,
    height: number,
    image: string,
    depth: number,
}

export const GAME_CONTAINER_ID = 'game-container';

export const GAME_FRAME_OFFSET = 48;

export const FRAME_RATE = 24;

export const BRING_TO_FRONT_DEPTH = 999;
export const GAME_MESSAGE_DEPTH = 1100;


export const GLOBAL_REGISTRY_TRANSLATIONS = 'translations';
export const GLOBAL_REGISTRY_GAME_DATA = 'game-data';
export const GLOBAL_REGISTRY_PLAYER = 'player';
export const GLOBAL_REGISTRY_TEXTURES = 'textures';

export const GAME_SCENE_SCALE_FACTOR = 'scale-factor';


export const SPRITES: Record<string, Sprite> = {
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
