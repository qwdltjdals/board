package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Test;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TestMapper {
    int save(Test test);
}
