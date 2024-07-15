package com.playcorners.controller;

import com.playcorners.controller.message.LoginRequest;
import com.playcorners.controller.message.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("permitAll()")
@RequestMapping("/login")
public class LoginController {

    @PostMapping
    public ResponseEntity<LoginResponse> handleLogin(LoginRequest loginRequest) {
        return ResponseEntity.ok().body(new LoginResponse(loginRequest.username(), "USER"));
    }
}
