package com.study.SpringSecurityMybatis.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Board {
    private Long id;
    private String title;
    private String content;
    private Long userId;
    private int viewCount;

    private User user; // 조인하기 위해서 이 게시글을 작성한 user를 가짐
}
