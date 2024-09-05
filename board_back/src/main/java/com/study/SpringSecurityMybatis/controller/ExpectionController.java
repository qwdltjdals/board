package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.exception.AccessTokenVailedException;
import com.study.SpringSecurityMybatis.exception.SignupException;
import com.study.SpringSecurityMybatis.exception.ValidException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExpectionController {

    @ExceptionHandler(ValidException.class)
    public ResponseEntity<?> Exception(ValidException e) {
        return ResponseEntity.badRequest().body(e.getFieldErrors());
    }

    @ExceptionHandler(SignupException.class)
    public ResponseEntity<?> signupException(SignupException e) {
        return ResponseEntity.internalServerError().body(e.getMessage()); // internalServerError = 500에러
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> authenticationException(AuthenticationException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(AccessTokenVailedException.class)
    public ResponseEntity<?> accessTokenVailedException(AccessTokenVailedException e) {
        return ResponseEntity.status(403).body(false);
    }

}
