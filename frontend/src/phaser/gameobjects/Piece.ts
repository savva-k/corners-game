import { Animations, GameObjects, Types } from 'phaser';
import { Game } from '../scenes/Game';
import { BRING_TO_FRONT_DEPTH, FRAME_RATE, SPRITES } from '../constan';
import { Coordinates } from './types';

const IDLE = 'idle';
const JUMP = 'jump';

const FALLBACK_ANIMATION_DURATION = 1000;
const MAX_DETUNE_VALUE = 1000;
const DETUNE_STEP = 100;

export default class Piece extends GameObjects.Sprite {

    textureName;
    jumpSound;
    detuneSound = 0;
    jumpAnimationDuration = FALLBACK_ANIMATION_DURATION;
    idleAnimationTimeout;

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

        this.idleAnimationTimeout = setTimeout(() => this.anims.play(IDLE), Math.random() * 5000);
    }

    destroy(fromScene?: boolean): void {
        if (this.idleAnimationTimeout) {
            clearTimeout(this.idleAnimationTimeout);
        }
        super.destroy(fromScene);
    }

    moveTo(coordinates: Coordinates[]) {
        this.scene.tweens.chain({
            delay: 200,
            targets: this,
            tweens: [...coordinates.map(coords => this.createTweenToCoords(coords))],
            onComplete: () => this.onMoveComplete(),
            paused: false,
        });
    }

    private onMoveStart() {
        this.setDepth(BRING_TO_FRONT_DEPTH);
        this.anims.play(JUMP);
        this.jumpSound.play({ detune: this.getDetuneValue() });
    }

    private onMoveComplete() {
        this.setDepth(SPRITES[this.textureName].depth);
        this.anims.play(IDLE);
    }

    private getDetuneValue() {
        if (this.detuneSound > MAX_DETUNE_VALUE) {
            this.detuneSound = 0;
        }
        const val = this.detuneSound;
        this.detuneSound += DETUNE_STEP;
        return val;
    }

    private createTweenToCoords(coords: Coordinates): Types.Tweens.TweenBuilderConfig {
        return {
            delay: 100,
            targets: this,
            duration: this.jumpAnimationDuration,
            ease: 'Linear',
            x: coords.x,
            y: coords.y,
            onStart: () => this.onMoveStart(),
        }
    }

}
