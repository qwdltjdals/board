package com.study.SpringSecurityMybatis.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardList {
    private Long id;
    private String title;
    private String content;
    private String writerName;
    private String writerProfileImg;
    private Integer LikeCount;
    private Integer viewCount;
}
