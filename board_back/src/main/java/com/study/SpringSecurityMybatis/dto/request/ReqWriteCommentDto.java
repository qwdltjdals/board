package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Comment;
import lombok.Data;

@Data
public class ReqWriteCommentDto {
    private Long boardId;
    private Long parentId; // 이게 안들어오면 대댓글이 아니라 일반 댓글
    private String content;

    public Comment toEntity(Long writeId) {
        return Comment.builder()
                .boardId(boardId)
                .parentId(parentId)
                .content(content)
                .writerId(writeId)
                .build();
    }
}
