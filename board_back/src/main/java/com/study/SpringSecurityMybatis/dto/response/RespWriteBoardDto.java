package com.study.SpringSecurityMybatis.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RespWriteBoardDto {
    private String message;
    private Long boardId;
}
