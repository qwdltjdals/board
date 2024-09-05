package com.study.SpringSecurityMybatis.config;

import com.study.SpringSecurityMybatis.security.filter.JwtAccessTokenFilter;
import com.study.SpringSecurityMybatis.security.handler.AuthenticationHandler;
import com.study.SpringSecurityMybatis.security.handler.Oauth2SuccessHandler;
import com.study.SpringSecurityMybatis.service.OAuth2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity // 원래 기능 말고 내가 커스텀하는 것을 쓰겠다
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAccessTokenFilter jwtAccessTokenFilter;

    @Autowired
    private AuthenticationHandler authenticationHandler;

    @Autowired
    private Oauth2SuccessHandler oauth2SuccessHandler;

    @Autowired
    private OAuth2Service oAuth2Service;




    @Override // ctrl + o
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin().disable();
        http.httpBasic().disable();
        http.csrf().disable();
        http.headers().frameOptions().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS); // 시큐리티 세션 저장소 사용 안하겠다
        http.cors(); // WebMvcConfig 설정을 따라감

        http.oauth2Login()
                .successHandler(oauth2SuccessHandler) // 핸들러랑 연결
                .userInfoEndpoint() // 이때 유저 로그인 정보를 가져옴 -> Oauth2UserRequest로 가져옴
                .userService(oAuth2Service);

        http.exceptionHandling().authenticationEntryPoint(authenticationHandler); // eAuthentication오류가 터지면 ㅁ원래 403오류가 나는데 이제 이리로 갈거임
        http.authorizeRequests()
                .antMatchers("/auth/**", "/h2-console/**")
                .permitAll()
                .anyRequest()
                .authenticated();
        http.addFilterBefore(jwtAccessTokenFilter, UsernamePasswordAuthenticationFilter.class); // 이 필터를, 얘 앞에 잡아주겠다
    }
}
