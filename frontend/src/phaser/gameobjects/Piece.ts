import { Animations, GameObjects } from 'phaser';
import { Game } from '../scenes/Game';
import { FRAME_RATE, SPRITES } from '../constan';

const IDLE = 'idle';
const JUMP_VERTICAL = 'jump-vertical';
const JUMP_HORIZONTAL = 'jump-horizontal';

const FALLBACK_ANIMATION_DURATION = 1000;

export default class Piece extends GameObjects.Sprite {

    horizontalJumpAnimationDuration;
    verticalJumpAnimationDuration;

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

        const horizontalJumpAnimation = this.anims.create({
            key: JUMP_HORIZONTAL,
            frameRate: FRAME_RATE,
            repeat: 0,
            frames: [
                { key: texture, frame: 3, duration: 30 },
                { key: texture, frame: 4, duration: 30 },
                { key: texture, frame: 5, duration: 30 },
                { key: texture, frame: 17, duration: 300 },
                { key: texture, frame: 18, duration: 30 },
                { key: texture, frame: 19, duration: 30 },
            ],
        });

        const verticalJumpAnimation = this.anims.create({
            key: JUMP_VERTICAL,
            frameRate: FRAME_RATE,
            repeat: 0,
            frames: this.anims.generateFrameNumbers(texture, { start: 3, end: 18 }),
        });

        this.on('animationcomplete', (animation: Animations.Animation, _frame: Animations.AnimationFrame) => {
            if (animation.key === JUMP_VERTICAL || animation.key === JUMP_HORIZONTAL) {
                this.anims.play(IDLE);
            }
        }, this);

        if (horizontalJumpAnimation) {
            this.horizontalJumpAnimationDuration = horizontalJumpAnimation.duration || FALLBACK_ANIMATION_DURATION;
        }

        if (verticalJumpAnimation) {
            this.verticalJumpAnimationDuration = verticalJumpAnimation.duration || FALLBACK_ANIMATION_DURATION;
        }

        setTimeout(() => this.anims.play(IDLE), Math.random() * 5000);
    }

    moveTo(x: number, y: number) {
        const horizontal = this.x - x > 0 || this.x - x < 0;
        const duration = (horizontal ? this.horizontalJumpAnimationDuration : this.verticalJumpAnimationDuration);

        this.scene.tweens.add({
            targets: this,
            duration: duration,
            ease: 'Linear',
            x: x,
            y: y,
            onStart: () => this.anims.play(horizontal ? JUMP_HORIZONTAL : JUMP_VERTICAL),
            onComplete: () => console.log('Done'),
        });
        
    }

}
