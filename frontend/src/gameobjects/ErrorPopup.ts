import { GAME_MESSAGE_DEPTH } from "../constan";

const PADDING = 10;
const FONT_COLOR = '#011627';
const FONT_SIZE = 24;
const BG_COLOR = 0xF7AEF8;
const BG_OPACITY = 0.9;
const FADE_DELAY = 1000;
const FADE_DURATION = 2000;

export function showErrorPopup(scene: Phaser.Scene, message: string) {
    const x = scene.scale.width / 2;
    const y = scene.scale.height / 2;
    const group = scene.add.group();
    const label = scene.add.text(
        x,
        y,
        message,
        {
            fontSize: FONT_SIZE,
            color: FONT_COLOR,
            wordWrap: {
                width: scene.scale.width - 2 * PADDING,
                useAdvancedWrap: true,
            }
        }
    )
        .setOrigin(0.5, 0.5)
        .setDepth(GAME_MESSAGE_DEPTH);
    const rect = scene.add.rectangle(x, y, label.width + PADDING, label.height + PADDING, BG_COLOR, BG_OPACITY)
        .setOrigin(0.5, 0.5)
        .setDepth(GAME_MESSAGE_DEPTH - 1);

    group.add(label);
    group.add(rect);


    scene.events.emit('error-popup-shown');

    scene.time.delayedCall(FADE_DELAY, () => {
        scene.tweens.add({
            targets: [label, rect],
            alpha: 0,
            duration: FADE_DURATION,
            ease: 'Linear',
            onComplete: () => group.destroy(true),
        });
    });
};
