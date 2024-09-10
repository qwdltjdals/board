package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.aspect.annotation.ValidAop;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteBoardDto;
import com.study.SpringSecurityMybatis.dto.response.RespWriteBoardDto;
import com.study.SpringSecurityMybatis.entity.Test;
import com.study.SpringSecurityMybatis.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
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

    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> getDetail(@PathVariable Long boardId) {
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

    @DeleteMapping("/board/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long boardId) {
        boardService.deleteBoard(boardId);
        return ResponseEntity.ok().body(true);
    }
}
