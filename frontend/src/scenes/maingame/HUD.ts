import { GAME_FRAME_OFFSET } from "../../constan";
import type { Piece, Player } from "../../model";
import { getPieceTexture } from "../../utils/GameBoardUtils";


const OUT_OF_SCREEN = -100;
const MARGIN_5PX = 5;
const MARGIN_10PX = 5;

const CURRENT_TURN_LABEL_NAME = "currentTurnLabel";
const OPPNENT_NAME_CONTAINER_NAME = "opponentNameContainer";

export class HUD {
    scene: Phaser.Scene;
    translations!: (code: string) => string;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.translations = (s) => s; // todo fix i18n

    }

    public addPlayerLabel(player: Player) {
        const currentPlayersPieceTexture = getPieceTexture(player.piece);
        const pieceSprite = this.scene.add.sprite(0, 0, currentPlayersPieceTexture, 0);
        const playerLabel = this.scene.add.text(0, 0, player.name);
        const container = this.scene.add.container(0, 0, [pieceSprite, playerLabel]);
        const x = MARGIN_5PX;
        const y = this.scene.scale.gameSize.height - GAME_FRAME_OFFSET;

        container.setPosition(x, y);
        pieceSprite.setPosition(pieceSprite.width / 2, 0);
        playerLabel.setPosition(pieceSprite.x + pieceSprite.width / 2 + MARGIN_5PX, MARGIN_5PX);
    }

    public addOrReplaceOpponentLabel(name: string | null, piece: Piece) {
        let container = this.scene.children.getByName(OPPNENT_NAME_CONTAINER_NAME) as Phaser.GameObjects.Container;
        if (!container) {
            container = this.scene.add.container(0, 0).setName(OPPNENT_NAME_CONTAINER_NAME);
        }

        container.removeAll(true);
        const opponentName = name ? name : this.translations('in_game:waitingForOpponent');
        const opponentNameLabel = this.scene.add.text(0, 0, opponentName);

        const opponentPlayersPieceTexture = getPieceTexture(piece);
        const opponentPieceSprite = this.scene.add.sprite(0, 0, opponentPlayersPieceTexture, 0);

        container.add([opponentPieceSprite, opponentNameLabel]);
        opponentNameLabel.setPosition(opponentPieceSprite.width / 2 + MARGIN_5PX, MARGIN_5PX);

        const x = this.scene.scale.gameSize.width - opponentNameLabel.width - opponentPieceSprite.width;
        const y = GAME_FRAME_OFFSET - opponentNameLabel.height - MARGIN_10PX;

        container.setPosition(x, y);
    }

    public addCurrentTurnLabel() {
        let currentTurnLabel = this.scene.children.getByName(CURRENT_TURN_LABEL_NAME) as Phaser.GameObjects.Text;
        if (!currentTurnLabel) {
            currentTurnLabel = this.scene.add.text(OUT_OF_SCREEN, OUT_OF_SCREEN, '').setName(CURRENT_TURN_LABEL_NAME);
        }
        const y = this.scene.scale.gameSize.height - GAME_FRAME_OFFSET + currentTurnLabel.height - MARGIN_10PX;
        currentTurnLabel.setY(y);
    }

    public updateCurrentTurnLabel(currentPlayersMove: boolean, gameFinished: boolean) {
        const currentTurnLabel = this.scene.children.getByName(CURRENT_TURN_LABEL_NAME) as Phaser.GameObjects.Text;
        currentTurnLabel.text = this.getCurrentTurnLabelText(currentPlayersMove, gameFinished);
        currentTurnLabel.setX(this.scene.scale.gameSize.width / 2 - currentTurnLabel.width / 2)
    }

    private getCurrentTurnLabelText(currentPlayersMove: boolean, gameFinished: boolean) {
        let translationCode;

        if (gameFinished) {
            translationCode = 'in_game:gameFinished';
        } else {
            translationCode = currentPlayersMove ? 'in_game:yourTurn' : 'in_game:opponentsTurn';
        }

        return this.translations(translationCode);
    }
}
