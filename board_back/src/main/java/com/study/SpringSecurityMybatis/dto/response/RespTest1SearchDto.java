package com.study.SpringSecurityMybatis.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RespTest1SearchDto {
    private Long id;
    private String username;
    private String name;
    private int gender;
}
