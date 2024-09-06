package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Test;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
@Builder
public class ReqCreateTestDto {
    @NotBlank(message = "유저아이디는 공백일 수 없습니다.")
    private String username;
    @NotBlank(message = "이름을 입력해 주세요.")
    private String name;
    @NotBlank(message = "성별을 입력해 주세요.")
    private int gender;


    public Test toEntity() {
        return Test.builder()
                .username(username)
                .name(name)
                .gender(gender)
                .build();
    }
}

