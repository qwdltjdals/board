package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.User;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
public class ReqOauth2JoinDto {
    @Pattern(regexp = "^[a-z0-9]{6,}$", message = "사용자 이름은 6자이상의 영문 소문자, 숫자 조합이어야 합니다.")
    private String username;
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[~!@#$%^&*?])[a-zA-Z\\d~!@#$%^&*?]{8,16}$"
            , message = "비밀번호는 8자이상, 16자이하의 영문 대소문자, 숫자, 특수문자(~!@#$%^&*?)중 하나 이상 포함하여야 합니다.")
    private String password;
    private String checkPassword;
    @Pattern(regexp = "^[가-힣]+$", message = "이름은 한글로만 이루어져야 합니다.")
    private String name;
    @NotBlank(message = "이메일 주소를 입력해 주세요.")
    @Email(message = "이메일 형식이어야 합니다.")
    private String email;
    @NotBlank(message = "OAuth2 이름을 입력해 주세요.")
    private String oAuth2Name;
    @NotBlank(message = "제휴사명을 입력해 주세요.")
    private String provider;

    public User toEntity(BCryptPasswordEncoder passwordEncoder) { // dto는 ioc에 없으니까, 이걸 호출하는 service에서 BCryptPasswordEncoder 오토와이어드해서 넘겨줌
        return User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .name(name)
                .email(email)
                .build();
    }
}
