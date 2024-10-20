import { Animations, GameObjects } from 'phaser';
import { Game } from '../scenes/Game';
import { FRAME_RATE, SPRITES } from '../constan';

const IDLE = 'idle';
const JUMP_VERTICAL = 'jump-vertical';
const JUMP_HORIZONTAL = 'jump-horizontal';

export default class Piece extends GameObjects.Sprite {

    constructor(scene: Game, x: number, y: number, texture: string) {
        super(scene, x, y - (SPRITES[texture].height - SPRITES['cell'].height) / 2, texture, 0);
        this.scene.add.existing(this);
        this.setDepth(SPRITES[texture].depth);

        this.anims.create({
            key: IDLE,
            frameRate: FRAME_RATE,
            repeat: -1,
            frames: [
                { key: texture, frame: 0, duration: 1000 },
                { key: texture, frame: 1, duration: 1000 },
                { key: texture, frame: 0, duration: 1000 },
                { key: texture, frame: 2, duration: 1000 },
            ],
        });

        this.anims.create({
            key: JUMP_HORIZONTAL,
            frameRate: FRAME_RATE,
            repeat: 0,
            frames: [
                { key: texture, frame: 3, duration: 100 },
                { key: texture, frame: 4, duration: 100 },
                { key: texture, frame: 5, duration: 100 },
                { key: texture, frame: 17, duration: 300 },
                { key: texture, frame: 18, duration: 100 },
                { key: texture, frame: 19, duration: 100 },
            ],
        });

        this.anims.create({
            key: JUMP_VERTICAL,
            frameRate: FRAME_RATE,
            repeat: 0,
            frames: this.anims.generateFrameNumbers(texture, { start: 3, end: 19 }),
        });

        setTimeout(() => this.anims.play(IDLE), Math.random() * 5000);

        this.scene.events.on('cell-clicked', () => this.anims.play(JUMP_HORIZONTAL), this);

        this.on('animationcomplete', (animation: Animations.Animation, _frame: Animations.AnimationFrame) => {
            if (animation.key === JUMP_VERTICAL || animation.key === JUMP_HORIZONTAL) {
                this.anims.play(IDLE);
            }
        }, this);
    }
}
