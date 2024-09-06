package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqCreateTestDto;
import com.study.SpringSecurityMybatis.entity.Test;
import com.study.SpringSecurityMybatis.repository.TestMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestService {

    @Autowired
    private TestMapper testMapper;

    public int createTestUser(ReqCreateTestDto dto) {
        return testMapper.save(dto.toEntity());
    }
}
