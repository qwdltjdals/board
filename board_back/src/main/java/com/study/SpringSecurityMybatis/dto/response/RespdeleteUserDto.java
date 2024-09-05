package com.study.SpringSecurityMybatis.dto.response;

import com.study.SpringSecurityMybatis.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RespdeleteUserDto {

    private Boolean isDeleting;
    private String message;
    private User deleteUser;
}
