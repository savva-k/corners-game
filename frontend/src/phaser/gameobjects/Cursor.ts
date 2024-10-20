import { GameObjects, Animations } from 'phaser';
import { Game } from '../scenes/Game';
import { FRAME_RATE, SPRITES } from '../constan';

const BLINK = 'blink';

export default class Cursor extends GameObjects.Sprite {

    constructor(scene: Game) {
        super(scene, 0, 0, 'cursor', 0);

        this.setVisible(false);
        this.setDepth(SPRITES.cursor.depth);
        this.scene.add.existing(this);

        this.scene.events.on('cell-clicked', this.handleCellClick, this);

        this.anims.create({
            key: BLINK,
            frames: this.anims.generateFrameNumbers('cursor', { start: 0, end: 6 }),
            repeat: 0,
            frameRate: FRAME_RATE,
        });

        this.on('animationcomplete', (animation: Animations.Animation, _frame: Animations.AnimationFrame) => {
            if (animation.key === BLINK) {
                this.setFrame(0);
            }
        }, this);
    }

    handleCellClick(_name: string, x: number, y: number) {
        this.setX(x);
        this.setY(y);
        this.setVisible(true);
        this.anims.play(BLINK);
    }
}
