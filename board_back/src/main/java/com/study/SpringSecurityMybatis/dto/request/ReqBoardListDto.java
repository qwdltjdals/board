package com.study.SpringSecurityMybatis.dto.request;

import lombok.Data;

@Data
public class ReqBoardListDto {
    private Long page; // 페이지 번호
    private Long limit; // 한 페이지당 몇개?
}
