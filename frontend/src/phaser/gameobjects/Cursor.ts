import { GameObjects, Animations } from 'phaser';
import { Game } from '../scenes/Game';
import { FRAME_RATE, GAME_SCENE_SCALE_FACTOR, SPRITES } from '../constan';

const BLINK = 'blink';

export default class Cursor extends GameObjects.Sprite {

    clickSound;
    enabled = false;

    constructor(scene: Game) {
        super(scene, -100, -100, 'cursor', 0);

        this.setVisible(this.enabled);
        this.setDepth(SPRITES.cursor.depth);
        this.scene.add.existing(this);

        this.setScale(this.scene.registry.get(GAME_SCENE_SCALE_FACTOR));
        this.scene.events.on('cell-clicked', this.handleCellClick, this);

        this.clickSound = this.scene.sound.add('cursor-click');
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

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        this.setVisible(enabled);
    }

    private handleCellClick(_name: string, x: number, y: number) {
        if (!this.enabled) return;

        this.setX(x);
        this.setY(y);
        this.anims.play(BLINK);
        this.clickSound.play();
    }
}
