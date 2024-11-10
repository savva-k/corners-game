import { forwardRef, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main.ts';
import { EventBus } from './EventBus';
import { GAME_CONTAINER_ID } from './constan.ts';
import { getGameById, wsUrl } from '../api/index.ts';
import { useHistory, useParams } from 'react-router-dom';
import { Game, MAIN_GAME_SCENE_KEY, TurnRequest } from './scenes/Game.ts';
import GameContext from '../context/GameContext.tsx';
import { Turn } from '../model/Turn.ts';
import { useTheme } from 'styled-components';

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface ParamType {
    id: string;
}

interface ServerData {
    type: 'TURN',
    payload: Turn
}

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
    const history = useHistory();

    const makeTurn = (turnRequest: TurnRequest) => {
        ws.current && ws.current.send(JSON.stringify(turnRequest));
    }
    
    const handleServerMessage = (gameInstance: Game, serverData: string) => {
        const data = JSON.parse(serverData) as ServerData;
        switch (data.type) {
            case "TURN": {
                gameInstance.handleNewTurn(data.payload);
                break;
            }
        }
    }

    const initGameScene = (gameInstance: Game) => {
        gameInstance.setMakeTurn(makeTurn);
        gameInstance.setCurrentPlayer(player);

        getGameById(id)
            .then(response => {
                gameInstance.setGame(response.data);

                ws.current = new WebSocket(wsUrl + '/game/' + response.data.id);
                ws.current.addEventListener('open', () => {
                    connected.current = true;
                    console.log('Connected: game WS');
                });
                ws.current.addEventListener('close', () => {
                    connected.current = false;
                    console.log('Disconnected: game WS');
                    history.push('/');
                });
                ws.current.addEventListener('error', (error) => {
                    connected.current = false;
                    console.error('Error: game WS');
                    console.error(error);
                    history.push('/');
                });
                ws.current.addEventListener('message', (event) => {
                    if (event.data) {
                        handleServerMessage(gameInstance, event.data);
                    }
                });
            })
            .catch(e => {
                console.error(e);
                history.push('/');
            });
    }

    useLayoutEffect(() => {
        if (game.current === null) {
            game.current = StartGame(GAME_CONTAINER_ID, theme.colors.backgroundContent);

            if (typeof ref === 'function') {
                ref({ game: game.current, scene: null });
            } else if (ref) {
                ref.current = { game: game.current, scene: null };
            }

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
        <div id={GAME_CONTAINER_ID}></div>
    );

});

export default PhaserGame;
