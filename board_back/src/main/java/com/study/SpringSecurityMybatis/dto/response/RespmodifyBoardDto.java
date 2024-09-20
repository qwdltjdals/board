package com.study.SpringSecurityMybatis.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RespmodifyBoardDto {
    private Long boardId;
    private String title;
    private String content;
}
