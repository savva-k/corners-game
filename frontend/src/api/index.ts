import axios from "axios";
import { type Game } from "../model";
import { type TileMap } from "../model/TileMap";

const {
  VITE_CORNERS_SERVER_API_URL,
  VITE_CORNERS_SERVER_WEBSOCKET_URL
} = import.meta.env;

const apiUrl = VITE_CORNERS_SERVER_API_URL;

interface LoginResponse {
  username: string;
  role: string;
}

export const wsUrl = VITE_CORNERS_SERVER_WEBSOCKET_URL;

axios.defaults.withXSRFToken = true;

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

axiosClient.interceptors.response.use((response) => {
  if (response.data.error) {
    return Promise.reject(response.data.error);
  }
  return response;
});

export const getAllGames = () => {
  return axiosClient.get<Game[]>("/games");
};

export const getGameById = (gameId: string) => {
  return axiosClient.get<Game>("/games/" + gameId);
};

export const createGame = (mapName: string) => {
  return axiosClient.post("/games", { mapName });
};

export const joinGame = (gameId: string) => {
  return axiosClient.post(`/games/${gameId}/join`);
};

export const login = (username: string, password: string) => {
  return axiosClient.post<LoginResponse>("/login", { username, password });
};

export const getUserInfo = () => {
  return axiosClient.get<LoginResponse>("/login");
};

export const logout = () => {
  console.log("Logging out");
};

export const getFirstCsrfToken = () => {
  axiosClient.post("/csrf").catch((e) => { console.error(e); });
};

export const getTileMap = (tileMapName: string) => {
  return axiosClient.get<TileMap>(`/tile-maps/${tileMapName}`);
}
