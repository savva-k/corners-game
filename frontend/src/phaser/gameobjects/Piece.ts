import { Animations, GameObjects, Types } from 'phaser';
import { Game } from '../scenes/Game';
import { Piece as PieceEnum } from '../../model/Piece';
import { BRING_TO_FRONT_DEPTH, FRAME_RATE, GAME_SCENE_SCALE_FACTOR, SPRITES } from '../constan';
import { Coordinates } from './types';

const IDLE = 'idle';
const JUMP = 'jump';
const LOSE = 'lose';
const WIN = 'win';

const FALLBACK_ANIMATION_DURATION = 1000;
const MAX_DETUNE_VALUE = 1000;
const DETUNE_STEP = 100;

export default class Piece extends GameObjects.Sprite {

    textureName;
    jumpSound;
    pieceType;
    detuneSound = 0;
    jumpAnimationDuration = FALLBACK_ANIMATION_DURATION;

    constructor(scene: Game, x: number, y: number, pieceType: PieceEnum, texture: string) {
        super(scene, x, y, texture, 0);

        this.pieceType = pieceType;
        this.textureName = texture;

        this.scene.add.existing(this);
        this.setDepth(SPRITES[texture].depth);
        this.setScale(this.scene.registry.get(GAME_SCENE_SCALE_FACTOR));

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
            frames: this.anims.generateFrameNumbers(texture, { start: 3, end: 7 }),
        });

        this.anims.create({
            key: LOSE,
            repeat: 4,
            delay: Math.random() * 3000,
            frames: this.anims.generateFrameNumbers(texture, { start: 8, end: 14 }),
            duration: 700,
        });

        this.anims.create({
            key: WIN,
            repeat: 4,
            delay: Math.random() * 3000,
            frames: this.anims.generateFrameNumbers(texture, { start: 3, end: 7 }),
            duration: 700,
        });

        this.on('animationcomplete', (animation: Animations.Animation, _frame: Animations.AnimationFrame) => {
            if (animation.key === JUMP) {
                this.anims.play(IDLE);
            }
        }, this);

        if (jumpAnimation) {
            this.jumpAnimationDuration = jumpAnimation.duration || FALLBACK_ANIMATION_DURATION;
        }
    }

    moveToAnimated(coordinates: Coordinates[]) {
        this.scene.tweens.chain({
            delay: 200,
            targets: this,
            tweens: [...coordinates.map(coords => this.createTweenToCoords(coords))],
            onComplete: () => this.onMoveComplete(),
            paused: false,
        });
    }

    moveTo(coordinates: Coordinates) {
        this.x = coordinates.x;
        this.y = coordinates.y;
    }

    win() {
        this.anims.play(WIN);
    }

    lose() {
        this.anims.play(LOSE);
    }

    idle() {
        this.anims.play(IDLE);
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
