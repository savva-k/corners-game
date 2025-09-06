package com.playcorners.controller;

import com.playcorners.model.Game;
import com.playcorners.service.CornersGameService;
import com.playcorners.service.exception.CommonGameException;
import com.playcorners.service.exception.Reason;
import com.playcorners.util.ValidationConstants;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/games")
public class GameController {

    private final CornersGameService cornersGameService;

    @Autowired
    public GameController(CornersGameService cornersGameService) {
        this.cornersGameService = cornersGameService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public List<Game> getAllGames() {
        return cornersGameService.getGames();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{gameId}")
    public Game getGameById(
            @Valid
            @Pattern(regexp = ValidationConstants.UUID_REGEXP, message = ValidationConstants.INVALID_GAME_ID)
            @PathVariable("gameId") String gameId
    ) {
        return cornersGameService.getGameById(gameId).orElseThrow(() -> new CommonGameException(Reason.GAME_NOT_FOUND));
    }

}
