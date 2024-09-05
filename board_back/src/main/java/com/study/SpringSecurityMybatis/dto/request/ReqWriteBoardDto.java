package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
@Builder
public class ReqWriteBoardDto {
    @NotBlank(message = "제목을 입력해 주세요.")
    private String title;
    @NotBlank(message = "글 내용을 입력해 주세요.")
    private String content;
}
