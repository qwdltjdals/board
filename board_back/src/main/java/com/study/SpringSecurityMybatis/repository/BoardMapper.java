package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.BoardList;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Mapper
public interface BoardMapper {
    int save(Board board);
    Board findById(Long id);
    int modifyViewCountById(Long id);
    List<BoardList> findAllByStartIndexAndLimit( // 매개변수를 파람으로 받음!
            @Param("startIndex") Long page,
            @Param("limit") Long limit);
    List<BoardList> findAllBySearch(Map<String, Object> params); // xml로 데이터 넘길 때 객체로, 파람을 따로따로, 맵 형태로 보내ㅔ는거 다 됨
    int deleteBoardById(Long boardId);
    int getCountAll(); //넘겨줄거 없음
    int getCountAllBySearch(Map<String, Object> params);
}
