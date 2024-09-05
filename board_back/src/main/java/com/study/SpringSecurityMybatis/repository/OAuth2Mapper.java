package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.OAuth2User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OAuth2Mapper {
    OAuth2User save(OAuth2User oAuth2User);
}
