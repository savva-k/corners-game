import { forwardRef, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main.ts';
import { EventBus } from './EventBus';
import { GAME_CONTAINER_ID } from './constan.ts';
import { getGameById, wsUrl } from '../api/index.ts';
import { useParams } from 'react-router-dom';
import { Game, MAIN_GAME_SCENE_KEY, TurnRequest } from './scenes/Game.ts';
import GameContext from '../context/GameContext.tsx';
import { Turn } from '../model/Turn.ts';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TurnValidation } from '../model/TurnValidation.ts';

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface ParamType {
    id: string;
}

type ServerData = { type: 'TURN', payload: Turn }
    | { type: 'INVALID_TURN', payload: TurnValidation }

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
            })
            .catch(e => {
                console.error(e);
            });
    }

    useLayoutEffect(() => {
        if (game.current === null) {
            game.current = StartGame(GAME_CONTAINER_ID, theme.colors.backgroundContent, t);

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
