package com.study.SpringSecurityMybatis.exception;

public class AccessTokenVailedException extends RuntimeException{

    public AccessTokenVailedException(String message) {
        super(message);
    }

}
