package com.study.SpringSecurityMybatis.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Test {
    private Long id;
    private String username;
    private String name;
    private int gender;
}
