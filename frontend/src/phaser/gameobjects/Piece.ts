import { Animations, GameObjects } from 'phaser';
import { Game } from '../scenes/Game';
import { BRING_TO_FRONT_DEPTH, FRAME_RATE, SPRITES } from '../constan';

const IDLE = 'idle';
const JUMP = 'jump';

const FALLBACK_ANIMATION_DURATION = 1000;
const MAX_DETUNE_VALUE = 1000;
const DETUNE_STEP = 100;

export default class Piece extends GameObjects.Sprite {

    textureName;
    jumpSound;
    detuneSound = 0;
    jumpAnimationDuration;

    constructor(scene: Game, x: number, y: number, texture: string) {
        super(scene, x, y, texture, 0);

        this.textureName = texture;

        this.scene.add.existing(this);
        this.setDepth(SPRITES[texture].depth);

        this.jumpSound = this.scene.sound.add('piece-jump');
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
            onStart: () => this.onMoveStart(),
            onComplete: () => this.onMoveComplete(),
        }); 
    }

    private onMoveStart() {
        this.setDepth(BRING_TO_FRONT_DEPTH);
        this.anims.play(JUMP);
        this.jumpSound.play({ detune: this.getDetuneValue() });
    }

    private onMoveComplete() {
        this.setDepth(SPRITES[this.textureName].depth);
        this.anims.play(JUMP);
    }

    private getDetuneValue() {
        if (this.detuneSound > MAX_DETUNE_VALUE) {
            this.detuneSound = 0;
        }
        const val = this.detuneSound;
        this.detuneSound += DETUNE_STEP;
        return val;
    }

}
