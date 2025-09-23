import { CANVAS, Game, type Types } from 'phaser';
import { GAME_CONTAINER_ID } from './constan';
import { Game as MainGame } from './scenes/maingame/MainGameScene';
import { Loader } from './scenes/loading/LoaderScene';
import { WebsocketInit } from './scenes/loading/WebsocketInitScene';
import { wsUrl } from './api';
import { connect } from './WebSocket';
import { getTokenFromUrl } from './utils/JwtUtil';

const config: Types.Core.GameConfig = {
  type: CANVAS, //todo: AUTO is resolved to WEBGL which causes some gaps between tiles on mobiles sometimes
  width: '100%',
  height: '100%',
  parent: GAME_CONTAINER_ID,
  pixelArt: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.NONE, // FIT to enable scaling when type: AUTO issue is fixed. Gaps are present even when mode = NONE and type = AUTO
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    WebsocketInit,
    Loader,
    MainGame
  ]
};

const token = getTokenFromUrl();
connect(wsUrl + "?token=" + token)
  .then(ws => {
    const game = new Game({ ...config, parent: "game-container", backgroundColor: "#0f1217ff" });
    game.registry.set('ws', ws);
  })
  .catch(err => {
    console.error("WebSocket connection error: " + err);
  });
