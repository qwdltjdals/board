package com.study.SpringSecurityMybatis.dto.request;

import lombok.Data;

@Data
public class ReqSearchDto {
    private Long page;
    private Long limit;
    private String search;
    private String option;
}
