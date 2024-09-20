package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.aspect.annotation.ValidAop;
import com.study.SpringSecurityMybatis.dto.request.ReqBoardListDto;
import com.study.SpringSecurityMybatis.dto.request.ReqModifyBoardDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSearchDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteBoardDto;
import com.study.SpringSecurityMybatis.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.Console;
import java.util.Map;

@RestController
public class BoardController {

    @Autowired
    private BoardService boardService;

    @ValidAop
    @PostMapping("/board")
    public ResponseEntity<?> write(@Valid @RequestBody ReqWriteBoardDto dto, BindingResult bindingResult) {
        return ResponseEntity.ok().body(Map.of("boardId", boardService.writeBoard(dto))); // boardId를 프론트에 넘겨주는거
    }

    @GetMapping("/board/search")
    public ResponseEntity<?> getSearchBoards(ReqSearchDto dto) {
        return ResponseEntity.ok().body(boardService.getSearchBoard(dto));
    }

    @GetMapping("/board/list")
    public ResponseEntity<?> getBoards(ReqBoardListDto dto) {
        return ResponseEntity.ok().body(boardService.getBoardList(dto));
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> getDetail(@PathVariable Long boardId) {
        System.out.println(boardId);
        return ResponseEntity.ok().body(boardService.getBoardDetail(boardId));
    }

    @GetMapping("/board/{boardId}/like")
    public ResponseEntity<?> getLikeInfo(@PathVariable Long boardId) { // 유저아이디는 시큐리티 컨텍스홀더에 들어있음 / 없으면 null - 조회 안됨
        return ResponseEntity.ok().body(boardService.getBoardLike(boardId));
    }

    @PostMapping("/board/{boardId}/like")
    public ResponseEntity<?> like(@PathVariable Long boardId) { // 유저아이디는 시큐리티 컨텍스홀더에 들어있음 / 없으면 null - 조회 안됨
        boardService.like(boardId);
        return ResponseEntity.ok().body(true);
    }

    @DeleteMapping("/board/like/{boardLikeId}")
    public ResponseEntity<?> disLike(@PathVariable Long boardLikeId) { // 유저아이디는 시큐리티 컨텍스홀더에 들어있음 / 없으면 null - 조회 안됨
        boardService.disLike(boardLikeId);
        return ResponseEntity.ok().body(true);
    }

    @DeleteMapping("/board/delete/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long boardId) {
        boardService.deleteBoard(boardId);
        return ResponseEntity.ok().body(true);
    }

    @GetMapping("/board/modify/{boardId}")
    public ResponseEntity<?> getBoardModify(@PathVariable Long boardId) {
        System.out.println(boardId);
        return ResponseEntity.ok().body(boardService.getBoardModify(boardId));
    }

    @PutMapping("/board/modify/{boardId}")
    public ResponseEntity<?> modifyBoard(ReqModifyBoardDto dto) {
        boardService.modifyBoard(dto);
        return ResponseEntity.ok().body(true);
    }
}
