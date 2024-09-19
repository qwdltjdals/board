package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqBoardListDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSearchDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteBoardDto;
import com.study.SpringSecurityMybatis.dto.response.RespBoardDetailDto;
import com.study.SpringSecurityMybatis.dto.response.RespBoardLikeInfoDto;
import com.study.SpringSecurityMybatis.dto.response.RespBoardListDto;
import com.study.SpringSecurityMybatis.dto.response.RespWriteBoardDto;
import com.study.SpringSecurityMybatis.entity.Board;
import com.study.SpringSecurityMybatis.entity.BoardLike;
import com.study.SpringSecurityMybatis.entity.BoardList;
import com.study.SpringSecurityMybatis.exception.AccessDeniedException;
import com.study.SpringSecurityMybatis.exception.NotFoundBoardException;
import com.study.SpringSecurityMybatis.repository.BoardLikeMapper;
import com.study.SpringSecurityMybatis.repository.BoardMapper;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.PublicKey;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.jar.Attributes;

@Service
public class BoardService {

    @Autowired
    private BoardMapper boardMapper;

    @Autowired
    private BoardLikeMapper boardLikeMapper;

    public Long writeBoard(ReqWriteBoardDto dto) {
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal(); // 유저 정보가 들어있음

        Board board = dto.toEntity(principalUser.getId());
        boardMapper.save(board);
        return board.getId();
    }

    public RespBoardListDto getSearchBoard(ReqSearchDto dto) {
        Long startIndex = (dto.getPage() -1) * dto.getLimit(); // 리미트 적용 시 사용되는 규칙
        Map<String, Object> params = Map.of(
                "startIndex", startIndex,
                "limit", dto.getLimit(),
                "searchValue", dto.getSearch() == null ? "" : dto.getSearch(),
                "option", dto.getOption() == null ? "all" : dto.getOption()
        );
        List<BoardList> boardLists = boardMapper.findAllBySearch(params);
        Integer boardTotalCount = boardMapper.getCountAllBySearch(params); // 카운트 전체 갯수

        return RespBoardListDto.builder()
                .boards(boardLists)
                .totalCount(boardTotalCount)
                .build();
    }

    public RespBoardListDto getBoardList(ReqBoardListDto dto) {
        Long startIndex = (dto.getPage() -1) * dto.getLimit(); // 리미트 적용 시 사용되는 규칙
        List<BoardList> boardLists = boardMapper.findAllByStartIndexAndLimit(startIndex, dto.getLimit());
        Integer boardTotalCount = boardMapper.getCountAll(); // 카운트 전체 갯수

        return RespBoardListDto.builder()
                .boards(boardLists)
                .totalCount(boardTotalCount)
                .build();
    }

    public RespBoardDetailDto getBoardDetail(Long boardId) {
        Board board = boardMapper.findById(boardId);

        if(board == null) {
            throw new NotFoundBoardException("해당 게시글을 찾을 수 없습니다.");
        }
        boardMapper.modifyViewCountById(boardId); // 업데이트 되는 시점

        return RespBoardDetailDto.builder()
                .boardId(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .writerId(board.getUserId())
                .writerUsername(board.getUser().getUsername())
                .viewCount(board.getViewCount() + 1)
                .build();
    }

    public RespBoardLikeInfoDto getBoardLike(Long boardId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = null;
        if(!authentication.getName().equals("anonymousUser")) { // 로그인이 완료된 사용자면
            PrincipalUser principalUser = (PrincipalUser) authentication.getPrincipal();
            userId = principalUser.getId();
        }
        BoardLike boardLike = boardLikeMapper.findByBoardIdAndUserId(boardId, userId);
        int likeCount = boardLikeMapper.getLikeCountByBoardId(boardId);
        return RespBoardLikeInfoDto.builder()
                .boardLikeId(boardLike == null ? 0 : boardLike.getId())
                .likeCount(likeCount)
                .build();
    }

    public void like(Long boardId) { // 라이크 누르는거
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder
                .getContext().getAuthentication()
                .getPrincipal();

        BoardLike boardLike = BoardLike.builder()
                .boardId(boardId)
                .userId(principalUser.getId())
                .build();

        boardLikeMapper.save(boardLike);
    }

    public void disLike(Long boardLikeId) { // 라이크 삭제하는거
        boardLikeMapper.deleteById(boardLikeId);
    }

    public void deleteBoard(Long boardId) {
        PrincipalUser principalUser = (PrincipalUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Board board = boardMapper.findById(boardId);
        if(principalUser.getId() != board.getId()) {
            throw new AccessDeniedException();
        }
        boardMapper.deleteBoardById(boardId);
    }
}