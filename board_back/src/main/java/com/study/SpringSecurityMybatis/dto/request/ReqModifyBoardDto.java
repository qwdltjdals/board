package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.User;
import lombok.Data;

@Data
public class ReqModifyBoardDto {
    private Long boardId;
    private String title;
    private String content;

    public Board toEntity(Long userId) {
        return Board.builder()
                .id(boardId)
                .title(title)
                .content(content)
                .userId(userId)
                .build();
    }
}


