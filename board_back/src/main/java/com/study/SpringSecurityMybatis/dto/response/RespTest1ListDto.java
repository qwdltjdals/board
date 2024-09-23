package com.study.SpringSecurityMybatis.dto.response;

import com.study.SpringSecurityMybatis.entity.BoardList;
import com.study.SpringSecurityMybatis.entity.Test;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RespTest1ListDto {
    private List<Test> tests;
    private Integer totalCount;
}
