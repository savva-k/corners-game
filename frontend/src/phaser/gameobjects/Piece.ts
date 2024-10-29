import { Animations, GameObjects } from 'phaser';
import { Game } from '../scenes/Game';
import { FRAME_RATE, SPRITES } from '../constan';

const IDLE = 'idle';
const JUMP = 'jump';

const FALLBACK_ANIMATION_DURATION = 1000;

export default class Piece extends GameObjects.Sprite {

    jumpAnimationDuration;

    constructor(scene: Game, x: number, y: number, texture: string) {
        super(scene, x, y, texture, 0);
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

        const jumpAnimation = this.anims.create({
            key: JUMP,
            frameRate: FRAME_RATE,
            repeat: 0,
            frames: [
                { key: texture, frame: 3, duration: 30 },
                { key: texture, frame: 4, duration: 30 },
                { key: texture, frame: 6, duration: 30 },
                { key: texture, frame: 5, duration: 60 },
                { key: texture, frame: 7, duration: 30 },
            ],
        });

        this.on('animationcomplete', (animation: Animations.Animation, _frame: Animations.AnimationFrame) => {
            if (animation.key === JUMP) {
                this.anims.play(IDLE);
            }
        }, this);

        if (jumpAnimation) {
            this.jumpAnimationDuration = jumpAnimation.duration || FALLBACK_ANIMATION_DURATION;
        }

        setTimeout(() => this.anims.play(IDLE), Math.random() * 5000);
    }

    moveTo(x: number, y: number) {
        this.scene.tweens.add({
            targets: this,
            duration: this.jumpAnimationDuration,
            ease: 'Linear',
            x: x,
            y: y,
            onStart: () => this.anims.play(JUMP),
            onComplete: () => console.log('Done'),
        });
        
    }

}
