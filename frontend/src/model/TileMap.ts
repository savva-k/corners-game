export interface Frame {
    number: number,
    duration: number,
}

export interface Animation {
    key: string,
    repeat: number,
    frames: Frame[],
}

export interface TileMap {
    name: string,
    imageUrl: string,
    tileWidth: number,
    tileHeight: number,
    animations: Record<string, Animation>,
}
