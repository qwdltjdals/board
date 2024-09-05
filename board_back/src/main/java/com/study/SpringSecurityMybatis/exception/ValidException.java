package com.study.SpringSecurityMybatis.exception;

import lombok.Getter;
import org.springframework.validation.FieldError;

import java.util.List;

public class ValidException extends RuntimeException{

    @Getter
    private List<FieldError> fieldErrors;

    public ValidException(String message, List<FieldError> fieldErrors) {
        super(message); // 예외처리된 메시지가 뜰거임
        this.fieldErrors = fieldErrors;
    }
}
