type Sprite = {
    width: number,
    height: number,
    image: string,
}

export const GAME_CONTAINER_ID = 'game-container';

export const GAME_FIELD_OFFSET = 48;

export const SPRITES: Record<string, Sprite> = {
    cell: {
        width: 48,
        height: 48,
        image: 'sprites/base-cell-sprite.png',
    }
}
