package com.playcorners.controller.exception;

import com.playcorners.controller.message.ErrorResponse;
import com.playcorners.controller.message.GameError;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GameExceptionMapper implements ExceptionMapper<GameError> {
    @Override
    public Response toResponse(GameError gameError) {
        return Response.status(Response.Status.OK).entity(new ErrorResponse(gameError.getReason())).build();
    }
}
