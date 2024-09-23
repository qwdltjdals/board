package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Test;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TestMapper {
    int save(Test test);
    Test searchTestById(Long id);
    List<Test> testList(
            @Param("startIndex") Long page,
            @Param("limit") Long limit
    );
    int getCountAll();
    int deleteTest(Long id);
}
