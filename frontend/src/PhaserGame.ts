import StartGame from './index.ts';
import { EventBus } from './EventBus';
import { GAME_CONTAINER_ID } from './constan.ts';
import { getGameById, wsUrl } from './api/index.ts';
import { useParams } from 'react-router-dom';
import { Game, MAIN_GAME_SCENE_KEY, TurnRequest } from './scenes/Game.ts';
import GameContext from '../context/GameContext.tsx';
import { type Turn } from './model/Turn.ts';
import { type TurnValidationResponse } from './model/TurnValidationResponse.ts';
import { type GameOverResponse } from './model/GameOverResponse.ts';

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface ParamType {
    id: string;
}

type TurnResponse = {
    type: 'TURN',
    payload: Turn,
};

type InvalidTurnResponse = {
    type: 'INVALID_TURN',
    payload: TurnValidationResponse,
};

type GameException = {
    type: 'GAME_EXCEPTION',
    payload: string,
}

type GameOver = {
    type: 'GAME_OVER',
    payload: GameOverResponse,
}

type ServerData = TurnResponse | InvalidTurnResponse | GameException | GameOver;

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void,
}

const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref) {
    const theme: any = useTheme();
    const game = useRef<Phaser.Game | null>(null!);
    const { id } = useParams<ParamType>();
    const ws = useRef<WebSocket | null>(null);
    const connected = useRef<boolean>(false);
    const { player } = useContext(GameContext);
    const { t } = useTranslation();

    const makeTurn = (turnRequest: TurnRequest) => {
        ws.current && ws.current.send(JSON.stringify(turnRequest));
    }

    const handleServerMessage = (gameInstance: Game, serverData: string) => {
        const data = JSON.parse(serverData) as ServerData;
        switch (data.type) {
            case "TURN": {
                gameInstance.handleNewTurn(data.payload);
                break;
            };
            case "INVALID_TURN": {
                gameInstance.handleInvalidTurn(data.payload);
                break;
            };
            case "GAME_EXCEPTION": {
                gameInstance.handleException(data.payload);
                break;
            };
            case "GAME_OVER": {
                gameInstance.handleGameOver(data.payload.finishReason, data.payload.winner);
                break;
            }
        }
    }

    const initGameScene = (gameInstance: Game) => {
        gameInstance.setMakeTurn(makeTurn);

        ws.current = new WebSocket(wsUrl + '/game/' + gameInstance.getGameId());
        ws.current.addEventListener('open', () => {
            connected.current = true;
            console.log('Connected: game WS');
        });
        ws.current.addEventListener('close', () => {
            connected.current = false;
            console.log('Disconnected: game WS');
        });
        ws.current.addEventListener('error', (error) => {
            connected.current = false;
            console.error('Error: game WS');
            console.error(error);
        });
        ws.current.addEventListener('message', (event) => {
            if (event.data) {
                handleServerMessage(gameInstance, event.data);
            }
        });
    }

    let initialized = false;
    useLayoutEffect(() => {
        if (game.current === null && !initialized) {
            initialized = true;
            getGameById(id)
                .then(response => {
                    game.current = StartGame({
                        parent: GAME_CONTAINER_ID,
                        backgroundColor: theme.colors.backgroundContent,
                        translations: t,
                        gameData: response.data,
                        player: player
                    });

                    if (typeof ref === 'function') {
                        ref({ game: game.current, scene: null });
                    } else if (ref) {
                        ref.current = { game: game.current, scene: null };
                    }
                })
                .catch(e => {
                    console.error(e);
                });
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                if (game.current !== null) {
                    game.current = null;
                }
            }
        }
    }, [ref]);

    useEffect(() => {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
            if (currentActiveScene && typeof currentActiveScene === 'function') {
                currentActiveScene(scene_instance);
            }

            if (typeof ref === 'function') {
                ref({ game: game.current, scene: scene_instance });
            } else if (ref) {
                ref.current = { game: game.current, scene: scene_instance };
            }

            if (scene_instance.scene.key == MAIN_GAME_SCENE_KEY) {
                initGameScene(scene_instance as Game);
            }
        });
        return () => {
            EventBus.removeListener('current-scene-ready');
            ws.current && connected.current && ws.current.close();
        }
    }, [currentActiveScene, ref]);

    return (
        <div id= { GAME_CONTAINER_ID } > </div>
    );

});

export default PhaserGame;
