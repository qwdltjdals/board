package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.BoardLike;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BoardLikeMapper {
    int save(BoardLike boardLike);
    int deleteById(Long id);
    BoardLike findByBoardIdAndUserId(
            @Param("boardId") Long boardId,
            @Param("userId") Long userId); // 찾으면 사용자가 추천을 누른 상태
    int getLikeCountByBoardId(Long boardId);
}
