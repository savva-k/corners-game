import { GameObjects, Input } from 'phaser';
import { Game } from '../scenes/Game';

export class Cell extends GameObjects.Sprite {

    constructor(scene: Game, name: string, x: number, y: number, dark: boolean) {
        super(scene, x, y, 'cell', dark ? 1 : 0);

        this.name = name;

        scene.add.existing(this);

        this.setInteractive();
        this.on('pointerdown', this.handleClick, this);

        if (scene.debug) {
            scene.add.text(x - 8, y - 8, name).setDepth(999);
        }
    }

    handleClick(_pointer: Input.Pointer) {
        this.scene.events.emit('cell-clicked', this.name);
    }
}
