import { GameObjects, Input } from 'phaser';
import { Game } from '../scenes/Game';
import { GAME_SCENE_SCALE_FACTOR } from '../constan';

export class Cell extends GameObjects.Sprite {

    constructor(scene: Game, name: string, x: number, y: number, texture: string, tileNumber: number) {
        super(scene, x, y, texture, tileNumber);

        this.name = name;

        scene.add.existing(this);

        this.setDepth(1);
        this.setInteractive();

        this.setScale(this.scene.registry.get(GAME_SCENE_SCALE_FACTOR));
        this.on('pointerdown', this.handleClick, this);

        if (scene.debug) {
            scene.add.text(x - 8, y - 8, name).setDepth(999);
        }
    }

    handleClick(_pointer: Input.Pointer) {
        this.scene.events.emit('cell-clicked', this.name, this.x, this.y);
    }
}
