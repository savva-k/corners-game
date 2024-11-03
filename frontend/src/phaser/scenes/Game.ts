import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { getTestGame } from '../../utils/GameBoardUtils';
import Field from '../gameobjects/Field';
import { SPRITES } from '../constan';
import Cursor from '../gameobjects/Cursor';

export class Game extends Scene {

    debug = false;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.setPath('assets');
        this.load.audio('background-music', 'sounds/little-slimex27s-adventure.mp3');
        this.load.audio('piece-jump', 'sounds/jump.wav');
        this.load.audio('cursor-click', 'sounds/click.wav');

        for (const name in SPRITES) {
            const sprite = SPRITES[name];
            this.load.spritesheet(name, sprite.image, { frameWidth: sprite.width, frameHeight: sprite.height });
        }
    }

    create() {
        new Field(this, getTestGame());
        new Cursor(this);
        this.turnOnMusic();
        EventBus.emit('current-scene-ready', this);
    }

    private turnOnMusic() {
        const bgMusic = this.sound.add('background-music');
        bgMusic.volume = 0.1;
        // bgMusic.play({ loop: true });
    }

}
