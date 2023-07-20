package com.playcorners.controller;

import com.playcorners.controller.message.GameError;
import com.playcorners.controller.message.LoginRequest;
import com.playcorners.controller.message.LoginResponse;
import com.playcorners.controller.message.Reason;
import com.playcorners.service.PlayerService;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/login")
public class LoginController {

    @Inject
    private PlayerService playerService;

    @POST
    public LoginResponse login(LoginRequest request) {
        return playerService.createPlayer(request.userName())
                .map(p -> new LoginResponse(true, p.getName()))
                .orElseThrow(() -> new GameError(Reason.CANNOT_CREATE_PLAYER));
    }

}
