import axios from "axios";
import { Game } from "../model";

const {
    REACT_APP_SECURE_PROTOCOL,
    REACT_APP_BACKEND_HOST,
    REACT_APP_BACKEND_PORT,
} = process.env;

const webProtocol = REACT_APP_SECURE_PROTOCOL ? "https" : "http";
const wsProtocol = REACT_APP_SECURE_PROTOCOL ? "wss" : "ws";
const host = REACT_APP_BACKEND_HOST || "localhost";
const port = REACT_APP_BACKEND_PORT || 8080;

const apiUrl = `${webProtocol}://${host}:${port}`;

export const wsUrl = `${wsProtocol}://${host}:${port}/ws`;

const axiosClient = axios.create({
    baseURL: apiUrl,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.response.use(response => {
    if (response.data.error) {
        return Promise.reject(response.data.error);
    }
    return response;
});

export const getAllGames = (userName: string) => {
    return axiosClient.get<Game[]>("/games");
};

export const getGameById = (gameId: string) => {
    return axiosClient.get<Game>("/games/" + gameId);
}

export const createGame = (userName: string) => {
    return axiosClient.post("/games", null, {
        headers: {
            'userName': userName
        }
    });
}

export const joinGame = (gameId: string, userName: string) => {
    return axiosClient.post(`/games/join`, null, {
        headers: {
            'userName': userName,
            'gameId': gameId
        }
    })
}

export const login = (userName: string, token: string) => {
    return axiosClient.post<{ userName: string }>("/login", { userName, token });
};
