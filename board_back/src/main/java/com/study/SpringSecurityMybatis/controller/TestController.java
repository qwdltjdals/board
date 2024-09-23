package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.dto.request.ReqCreateTestDto;
import com.study.SpringSecurityMybatis.dto.request.ReqTestListDto;
import com.study.SpringSecurityMybatis.service.TestService;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {

    @Autowired
    private TestService testService;

    @PostMapping("/test")
    public ResponseEntity<?> createTest(@RequestBody ReqCreateTestDto dto) {
        int successCount = testService.createTestUser(dto);
        return ResponseEntity.ok().body(successCount);
    }

    @GetMapping("/test/list")
    public ResponseEntity<?> testListAll(@RequestBody ReqTestListDto dto) {
        return ResponseEntity.ok().body(testService.testList(dto));
    }

    @GetMapping("test/{id}")
    public ResponseEntity<?> testSearchById(@PathVariable Long id) {
        return ResponseEntity.ok().body(testService.searchTestUser(id));
    }

    @DeleteMapping("test/{id}")
    public ResponseEntity<?> testDeleteById(@PathVariable Long id) {
        testService.deleteTest(id);
        return ResponseEntity.ok().body(true);
    }

    @PutMapping("test/{id}")
    public ResponseEntity<?> testPutById() {
        return ResponseEntity.ok().body(null);
    }
}
