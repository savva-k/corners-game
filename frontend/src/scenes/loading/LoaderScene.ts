import { Scene } from "phaser";
import { getTileMap } from "../../api";
import { type Game as GameModel } from '../../model/Game';
import { GLOBAL_REGISTRY_TEXTURES, SPRITES } from "../../constan";
import type { Player } from "../../model";

export class Loader extends Scene {

    gameData!: GameModel;
    player!: Player;

    constructor() {
        super({ key: 'Loader' });
    }

    init(data: { gameData: GameModel, player: Player }) {
        this.gameData = data.gameData;
        this.player = data.player;
        console.log("Loader init with gameData: " + JSON.stringify(this.gameData));
    }

    preload() {
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'logo').setScale(0.5);

        this.load.on('progress', (v: number) => {
            console.log("Loading progress: " + v * 100 + "%");
        });

        this.load.on('complete', () => {
            console.log("Enough loading, starting the game");
            this.startGame();
        });

        this.load.setPath('/assets');
        this.load.audio('background-music', 'sounds/little-slimex27s-adventure.mp3');
        this.load.audio('piece-jump', 'sounds/jump.wav');
        this.load.audio('cursor-click', 'sounds/click.wav');
        this.load.audio('exception', 'sounds/exception.wav');
        this.load.audio('winner', 'sounds/winning-218995.mp3');
        this.load.audio('loser', 'sounds/brass-fail-10-c-207138.mp3');

        // Load tilemaps dynamically by gathering all unique tile map names and requesting an API
        this.game.registry.set(GLOBAL_REGISTRY_TEXTURES, {});

        const requiredTileMaps = [...new Set(Object.values(this.gameData.gameMap.field).map(cell => cell.tileMapName))];
        console.log('Required tile maps: ' + requiredTileMaps);
        const loaded = new Set<string>();
        requiredTileMaps.forEach(tileMapName => {
            if (loaded.has(tileMapName)) {
                return;
            }
            getTileMap(tileMapName).then(res => {
                console.log('Loaded tile map ' + tileMapName + ': ' + JSON.stringify(res.data));
                const { name, imageUrl, tileWidth, tileHeight } = res.data;
                this.game.registry.get(GLOBAL_REGISTRY_TEXTURES)[name] = res.data;
                this.load.spritesheet(name, imageUrl, { frameWidth: tileWidth, frameHeight: tileHeight });
                loaded.add(tileMapName);
            }).catch(err => console.error('Error loading tile map ' + tileMapName + ': ' + err));
        });

        // Load static tile maps
        // todo: move them to the server
        for (const name in SPRITES) {
            const sprite = SPRITES[name];
            this.load.spritesheet(name, sprite.image, { frameWidth: sprite.width, frameHeight: sprite.height });
        }
    }

    startGame() {
        this.scene.start('Game', { gameData: this.gameData, player: this.player });
    }

    create() {
        console.log("Inside Loader scene");
    }

}