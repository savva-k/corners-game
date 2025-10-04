import type Piece from "../../gameobjects/Piece";

type Sound = Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

const PIECE_SOUND_DETUNE_STEP = 100;

export class SoundManager {

    scene: Phaser.Scene;
    bgMusic: Sound;
    clickSound: Sound;
    jumpSound: Sound;

    pieceSoundDetune: Map<Piece, number> = new Map();

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.bgMusic = this.scene.sound.add('background-music', { loop: true, volume: 0.5 });
        this.clickSound = this.scene.sound.add('cursor-click');
        this.jumpSound = this.scene.sound.add('piece-jump');

        this.scene.events.on('start-game', this.turnOnMusic, this);
        this.scene.events.on('finish-game', this.gameOver, this);
        this.scene.events.on('cursor-clicked', this.cursorClick, this);
        this.scene.events.on('piece-jumped', this.pieceJump, this);
        this.scene.events.on('piece-move-finished', this.pieceMoveFinished, this);
        this.scene.events.on('error-popup-shown', this.errorPopupShown, this);
    }

    private turnOnMusic() {
        this.bgMusic.play();
    }

    private gameOver(resultSoundKey: 'winner' | 'loser' | 'draw') {
        this.bgMusic.stop();
        this.scene.sound.play(resultSoundKey, { volume: 0.4 });
    }

    private cursorClick() {
        this.clickSound.play();
    }

    private pieceJump(piece: Piece) {
        this.jumpSound.play({ detune: this.getDetuneValue(piece) });
        this.jumpSound.play();
    }

    private pieceMoveFinished(piece: Piece) {
        this.pieceSoundDetune.set(piece, 0);
    }

    private errorPopupShown() {
        this.scene.sound.play('exception');
    }

    private getDetuneValue(piece: Piece) {
        if (!this.pieceSoundDetune.has(piece)) {
            this.pieceSoundDetune.set(piece, 0);
        }
        let detune = this.pieceSoundDetune.get(piece)! + PIECE_SOUND_DETUNE_STEP;

        this.pieceSoundDetune.set(piece, detune);
        return detune;
    }

}
