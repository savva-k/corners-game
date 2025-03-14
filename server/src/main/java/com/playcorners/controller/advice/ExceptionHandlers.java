package com.playcorners.controller.advice;

import com.playcorners.controller.message.ErrorResponse;
import com.playcorners.service.exception.CommonGameException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlers {

    @ExceptionHandler(value = MethodArgumentNotValidException.class, produces = "application/json")
    public ResponseEntity<ErrorResponse> handle(MethodArgumentNotValidException e) {
        String code = "unknown";
        if (e.getFieldError() != null) {
            code = e.getFieldError().getDefaultMessage();
        }
        return ResponseEntity.badRequest().body(new ErrorResponse(code));
    }

    @ExceptionHandler(value = CommonGameException.class, produces = "application/json")
    public ResponseEntity<ErrorResponse> handle(CommonGameException e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getReason().toString()));
    }
}
