package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.dto.request.ReqModifyCommentDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteCommentDto;
import com.study.SpringSecurityMybatis.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/board/comment")
    public ResponseEntity<?> writeComment(@RequestBody ReqWriteCommentDto dto) {
        commentService.write(dto);
        return ResponseEntity.ok().body(true);
    }

    @GetMapping("/board/{boardId}/comments") // 여러개의 댓글 정보 - List로 넘겨줌
    public ResponseEntity<?> getComments(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(commentService.getComments(boardId));
    }

    @DeleteMapping("/board/comment/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().body(true);
    }

    @PutMapping("/board/comment/{commentId}")
    public ResponseEntity<?> updateComment(@RequestBody ReqModifyCommentDto dto) {
        commentService.updateComment(dto);
        return ResponseEntity.ok().body(true);
    }
}
