package com.playcorners.controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/status")
public class AppStatusController {

    @GET
    @Path("/health")
    public Response healthcheck() {
        return Response.ok("Ready!").build();
    }

}
