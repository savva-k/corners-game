package com.playcorners.controller;

import com.playcorners.controller.message.Reason;
import com.playcorners.controller.message.GameError;
import com.playcorners.model.Game;
import com.playcorners.service.CornersGameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.LobbyWsEndpoint;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/games")
@RolesAllowed({"user", "admin"})
public class GameController {

    @Inject
    private CornersGameService cornersGameService;

    @Inject
    private PlayerService playerService;

    @Inject
    private LobbyWsEndpoint lobbyWsEndpoint;

    @GET
    public List<Game> getAllGames(@HeaderParam("userName") String userName) {
        return cornersGameService.getGames();
    }

    @GET
    @Path("/{gameId}")
    public Game getGameById(@PathParam("gameId") String gameId) {
        return cornersGameService.getGameById(gameId).orElseThrow(() -> new GameError(Reason.GAME_NOT_FOUND));
    }

    @POST
    public Response createGame() {
        cornersGameService.createGame(playerService.getPlayer())
                .ifPresentOrElse(
                        game -> lobbyWsEndpoint.broadcastGameUpdate(game),
                        () -> {
                            throw new GameError(Reason.GAME_NOT_CREATED);
                        }
                );

        return Response.ok().build();
    }

    @POST
    @Path("/join")
    public Response joinGame(@HeaderParam("gameId") String gameId) {
        lobbyWsEndpoint.broadcastGameUpdate(cornersGameService.joinGame(playerService.getPlayer(), gameId));
        return Response.ok().build();
    }

}
