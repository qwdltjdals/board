package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentMapper {
    int save(Comment comment);
    List<Comment> findAllByBoardId(Long boardId); // 게시글마다 댓글을 불러와야 함
    int getCommentCountByBoardId(Long boardId);
}
