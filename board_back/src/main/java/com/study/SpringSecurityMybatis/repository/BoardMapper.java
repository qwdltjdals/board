package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.BoardList;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardMapper {
    int save(Board board);
    Board findById(Long id);
    int modifyViewCountById(Long id);
    List<BoardList> findAllByStartIndexAndLimit( // 매개변수를 파람으로 받음!
            @Param("startIndex") Long page,
            @Param("limit") Long limit);
    int deleteBoardById(Long boardId);
    int getCountAll(); //넘겨줄거 없음
}
