package com.study.SpringSecurityMybatis.dto.response;

import com.study.SpringSecurityMybatis.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RespBoardDetailDto {
    private Long boardId;
    private String title;
    private String content;
    private Long writerId;
    private String writerUsername; // id에 해당하는 username을 가져와야함 - join해야함
    private int viewCount;
}
