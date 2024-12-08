package com.playcorners.controller.advice;

import com.playcorners.controller.message.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlers {

    @ExceptionHandler(value = MethodArgumentNotValidException.class, produces = "application/json")
    public ResponseEntity<ErrorResponse> handle(MethodArgumentNotValidException e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    }
}
