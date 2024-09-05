package com.study.SpringSecurityMybatis.security.handler;

import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.security.jwt.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Component
public class Oauth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler { // oath2로 로그인 성공하면 이리로 넘어옴

    @Autowired
    private UserMapper userMapper;

    @Autowired
    protected JwtProvider jwtProvider;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException { // authentication에 principal(defaultOauth2User),
        DefaultOAuth2User defaultOAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = defaultOAuth2User.getAttributes();
        String oAuth2Name = attributes.get("id").toString();
        String provider = attributes.get("provider").toString(); // oauthService에서 넣어줬던 것들

        User user = userMapper.findByOAuth2Name(authentication.getName()); // 유저가 있는지 확인 - authentication = (토큰, 프로바이더)
        if(user == null) { // 가입 정보가 없으면 프론트로 넘김 - 회원가입 / 회원통합
            response.sendRedirect("http://localhost:3000/user/join/oauth2?oAuth2Name=" + oAuth2Name + "&provider=" + provider);
            return;
        }
        String accessToken = jwtProvider.generateAccessToken(user);
        response.sendRedirect("http://localhost:3000/user/login/oauth2?accessToken=" + accessToken);
    }
}
// http://localhost:8080/oauth2/authorization/naver