package com.study.SpringSecurityMybatis.aspect;

import com.study.SpringSecurityMybatis.dto.request.ReqOauth2JoinDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSignupDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteBoardDto;
import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.exception.ValidException;
import com.study.SpringSecurityMybatis.service.UserService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

@Component
@Aspect
public class ValidAspect {

    @Autowired
    private UserService userService;

    @Pointcut("@annotation(com.study.SpringSecurityMybatis.aspect.annotation.ValidAop)")
    public void pointcut() {}

    @Around("pointcut()")
    public Object around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Object[] args = proceedingJoinPoint.getArgs();
        BeanPropertyBindingResult bindingResult = null; // 값 반환해줄 거

        for(Object arg : args) {
            if(arg.getClass() == BeanPropertyBindingResult.class) {
                bindingResult = (BeanPropertyBindingResult) arg;
            }
        }

        switch (proceedingJoinPoint.getSignature().getName()) { // 이 validation 체크를 어디서 사용할건지
            case "signup": // signup이 아니면 실행할 필요 없음
                validSignupDto(args, bindingResult);
                break;
            case "oAuth2Signup":
                validOAuth2JoinDto(args, bindingResult);
                break;
        }

        if(bindingResult.hasErrors()) {
            throw new ValidException("유효성 검사 오류", bindingResult.getFieldErrors());
        }

//        if(!dto.getPassword().equals(dto.getCheckPassword())) {
//            FieldError fieldError = new FieldError("checkPassword", "checkPassword", "비밀번호가 일치하지 않습니다.");
//            bindingResult.addError(fieldError);
//        }
//
//        if(userService.isDuplicateUsername(dto.getUsername())) { // 중복체크
//            FieldError fieldError = new FieldError("username", "username", "이미 존재하는 사용자 이름 입니다.");
//            bindingResult.addError(fieldError);
//        }
//
//        if(bindingResult.hasErrors()) {
//            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
//        }

        return proceedingJoinPoint.proceed();
    }

    private void validSignupDto(Object[] args, BeanPropertyBindingResult bindingResult) {
        for(Object arg : args) {
            if(arg.getClass() == ReqSignupDto.class) {
                ReqSignupDto dto = (ReqSignupDto) arg;

                if(!dto.getPassword().equals(dto.getCheckPassword())) {
                    FieldError fieldError
                            = new FieldError("checkPassword", "checkPassword" , "비밀번호가 일치하지 않습니다.");
                    bindingResult.addError(fieldError);
                }

                if(userService.isDuplicateUsername(dto.getUsername())) {
                    FieldError fieldError
                            = new FieldError("username", "username", "이미 존재하는 사용자 이름 입니다.");
                    bindingResult.addError(fieldError);
                }
                }
            }
        }
    private void validOAuth2JoinDto(Object[] args, BeanPropertyBindingResult bindingResult) {
        for(Object arg : args) {
            if(arg.getClass() == ReqOauth2JoinDto.class) {
                ReqOauth2JoinDto dto = (ReqOauth2JoinDto) arg;

                if(!dto.getPassword().equals(dto.getCheckPassword())) {
                    FieldError fieldError
                            = new FieldError("checkPassword", "checkPassword" , "비밀번호가 일치하지 않습니다.");
                    bindingResult.addError(fieldError);
                }

                if(userService.isDuplicateUsername(dto.getUsername())) {
                    FieldError fieldError
                            = new FieldError("username", "username", "이미 존재하는 사용자 이름 입니다.");
                    bindingResult.addError(fieldError);
                }
            }
        }
    }

    private void validWrite(Object[] args, BeanPropertyBindingResult bindingResult) {
        for(Object arg : args) {
            if(arg.getClass() == ReqWriteBoardDto.class) {
                ReqWriteBoardDto dto = (ReqWriteBoardDto) arg;

                if(dto.getContent() == null) {
                    FieldError fieldError = new FieldError("content", "content", "내용은 공백일 수 없습니다.");
                    bindingResult.addError(fieldError);
                }
            }
        }
    }
}
