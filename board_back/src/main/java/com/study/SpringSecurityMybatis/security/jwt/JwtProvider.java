package com.study.SpringSecurityMybatis.security.jwt;

import com.study.SpringSecurityMybatis.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    private final Key key;
// 로그인 했을때 토큰 생성
    public  JwtProvider(@Value("${jwt.secret}") String secret) { // @Value("${jwt.secret}") = yml에서 가져오는것
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)); // key라는 객체를 만들려면 써야함
    }

    public Date getExpireDate() {
        return new Date(new Date().getTime() + (1000L * 60 * 60 * 24 * 30)); // 현재시간 가져와서 30일 곱함
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .claim("userId", user.getId()) // id가져와야함
                .expiration(getExpireDate()) // 만료시간
                .signWith(key, SignatureAlgorithm.HS256) // 키값, 알고르즘
                .compact();
    }

    public String removeBearer(String bearerAccessToken) throws RuntimeException{
        if(bearerAccessToken == null) {
            throw new RuntimeException();
        }
        int bearerLength = "bearer ".length();
        return bearerAccessToken.substring(bearerLength);
    }

    public Claims getClaims(String token) {
        JwtParser jwtParser = Jwts.parser()
                .setSigningKey(key) // 이 키를 가지고 parsing을 해라
                .build();
        return jwtParser.parseClaimsJws(token).getPayload(); // parsing을 하면 Payload를 가져올 수 있다 Payload = claims
    }
}
