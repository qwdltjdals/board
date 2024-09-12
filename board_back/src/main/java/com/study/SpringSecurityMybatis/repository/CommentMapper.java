package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.dto.request.ReqModifyCommentDto;
import com.study.SpringSecurityMybatis.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentMapper {
    int save(Comment comment);
    List<Comment> findAllByBoardId(Long boardId); // 게시글마다 댓글을 불러와야 함 / 순서가 있는 자료형인 list로 가져와야함, set은 안됨 order쓴거 다날아감
    int getCommentCountByBoardId(Long boardId);
    int deleteById(Long id);
    Comment findById(Long id);
    Comment findByParentId(Long parentId);
    int updateComment(Comment comment);
}
