package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqCreateTestDto;
import com.study.SpringSecurityMybatis.dto.request.ReqTestListDto;
import com.study.SpringSecurityMybatis.dto.response.RespTest1ListDto;
import com.study.SpringSecurityMybatis.dto.response.RespTest1SearchDto;
import com.study.SpringSecurityMybatis.entity.BoardList;
import com.study.SpringSecurityMybatis.entity.Test;
import com.study.SpringSecurityMybatis.repository.TestMapper;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestService {

    @Autowired
    private TestMapper testMapper;

    public int createTestUser(ReqCreateTestDto dto) {
        return testMapper.save(dto.toEntity());
    }

    public RespTest1ListDto testList(ReqTestListDto dto) {
        Long startIndex = (dto.getPage() -1) *dto.getLimit();
        List<Test> testList = testMapper.testList(startIndex, dto.getLimit());
        Integer testTotalCount = testMapper.getCountAll(); // 카운트 전체 갯수

        return RespTest1ListDto.builder()
                .tests(testList)
                .totalCount(testTotalCount)
                .build();
    }

    public RespTest1SearchDto searchTestUser(Long id) {
        Test test = testMapper.searchTestById(id);
        return RespTest1SearchDto.builder()
                .id(test.getId())
                .name(test.getName())
                .username(test.getUsername())
                .gender(test.getGender())
                .build();
    }

    public void deleteTest(Long id) {
        testMapper.deleteTest(id);
    }
}
