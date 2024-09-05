package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.*;
import com.study.SpringSecurityMybatis.dto.response.*;
import com.study.SpringSecurityMybatis.entity.OAuth2User;
import com.study.SpringSecurityMybatis.entity.Role;
import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.entity.UserRoles;
import com.study.SpringSecurityMybatis.exception.SignupException;
import com.study.SpringSecurityMybatis.repository.OAuth2Mapper;
import com.study.SpringSecurityMybatis.repository.RoleMapper;
import com.study.SpringSecurityMybatis.repository.UserMapper;
import com.study.SpringSecurityMybatis.repository.UserRolesMapper;
import com.study.SpringSecurityMybatis.security.jwt.JwtProvider;
import com.study.SpringSecurityMybatis.security.principal.PrincipalUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Value("${user.profile.img.default}")
    private String defaultProfileImg;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private UserRolesMapper userRolesMapper;

    @Autowired
    private OAuth2Service oAuth2Service;

    @Autowired
    private OAuth2Mapper oAuth2Mapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    public Boolean isDuplicateUsername(String username) {
        return Optional.ofNullable(userMapper.findByUsername(username)).isPresent(); // isPresent
    }

    @Transactional(rollbackFor = SignupException.class) // 밑에 save가 세개 있는데 하나라도 잘못되면 데이터가 꼬이니까 하나라도 잘못되면(예외터지면) 롤백처리
    public RespSignupDto insertUserAndUserRoles(ReqSignupDto dto) throws SignupException { // dto를 User로 바꿔줘야함
        User user = null;
        try {
            user = dto.toEntity(passwordEncoder);
            userMapper.save(user); // 방금 save한 user를 가져옴

            Role role = roleMapper.findByName("ROLE_USER"); // 있으면 들고옴
            if (role == null) {
                role = Role.builder().name("ROLE_USER").build(); // 없으면 만듦
                roleMapper.save(role);
            }

            UserRoles userRoles = UserRoles.builder() // 두개 조인하는거?
                    .userId(user.getId())
                    .roleId(role.getId())
                    .build();

            userRolesMapper.save(userRoles);

            user.setUserRoles(Set.of(userRoles));
        } catch (Exception e) {
            throw new SignupException(e.getMessage());
        }

        return RespSignupDto.builder()
                .message("회원가입 완료")
                .user(user)
                .build();
    }

    public RespSigninDto getGeneratedToken(ReqSigninDto dto) {
        User user = checkUsernameAndPassword(dto.getUsername(), dto.getPassword());
        return RespSigninDto.builder()
                .expireDate(jwtProvider.getExpireDate().toString())
                .accessToken(jwtProvider.generateAccessToken(user))
                .build();
    }

    private User checkUsernameAndPassword(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user == null) { // 유저네임 잘못됨
            throw new UsernameNotFoundException("사용자 정보를 확인하세요.");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) { // 내가 입력한거랑 db에 있는거랑 다르면
            throw new BadCredentialsException("사용자 정보를 확인하세요.");
        }
        return user; // 예외가 발생하지 않으면 user 리턴
    }

    @Transactional(rollbackFor = SQLException.class)
    public RespdeleteUserDto deleteUser(Long id) {
        User user = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PrincipalUser principalUser = (PrincipalUser) authentication.getPrincipal();
        if (principalUser.getId() != id) { // 내가 로그인한 아이디랑 가져온 토큰이랑 같은지 확인
            throw new AuthenticationServiceException("삭제할 수 있는 권한이 없습니다.");
        }
        user = userMapper.findById(id);
        if (user == null) {
            throw new AuthenticationServiceException("해당 사용자는 존재하지 않는 사용자 입니다.");
        }
        userRolesMapper.deleteByUserId(id);
        userMapper.deleteById(id);

        return RespdeleteUserDto.builder()
                .isDeleting(true)
                .message("사용자 삭제 완료")
                .deleteUser(user)
                .build();
    }

    public RespUserInfoDto getUserInfo(Long id) {
        User user = userMapper.findById(id); // id 주고 id 찾아오라고 함 - User entity에 담음
        Set<String> roles = user.getUserRoles().stream().map( // roles는 user안에 들어있는 roles를 stream에다가 담을건데 반복을 돌릴게
                userRole -> userRole.getRole().getName() // userRole은 role을 가져와서 이름을 넣어줄게
        ).collect(Collectors.toSet()); // stream문자열로 가져온 걸 다시 set으로 바꿀게

        return RespUserInfoDto.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .img(user.getImg())
                .roles(roles)
                .build();
    }

    public Boolean updateProfileImg(ReqProfileDto dto) {
        PrincipalUser user =
                (PrincipalUser) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();
        if (dto.getImg() == null ||
                dto.getImg().isBlank()) {
            userMapper.modifyImgById(user.getId(), defaultProfileImg);
            return true;
        }
        userMapper.modifyImgById(user.getId(), dto.getImg());
        return true;
    }

    public OAuth2User mergeSignin(ReqOAuth2MergeDto dto) {
        User user = checkUsernameAndPassword(dto.getUsername(), dto.getPassword());
        return OAuth2User.builder()
                .userId(user.getId())
                .oAuth2Name(dto.getOauth2Name())
                .provider(dto.getProvider())
                .build();
    }

//    @Transactional(rollbackFor = SignupException.class) // 밑에 save가 세개 있는데 하나라도 잘못되면 데이터가 꼬이니까 하나라도 잘못되면(예외터지면) 롤백처리
//    public RespOAuth2JoinDto joinSignup(ReqOauth2JoinDto dto) throws SignupException {
//        User user = null;
//        try {
//            user = dto.toEntity(passwordEncoder);
//            userMapper.save(user);
//
//            Role role = roleMapper.findByName("ROLE_USER"); // 있으면 들고옴
//            if (role == null) {
//                role = Role.builder().name("ROLE_USER").build(); // 없으면 만듦
//                roleMapper.save(role);
//            }
//            UserRoles userRoles = UserRoles.builder() // 두개 조인하는거?
//                    .userId(user.getId())
//                    .roleId(role.getId())
//                    .build();
//
//            userRolesMapper.save(userRoles);
//
//            OAuth2User oAuth2User = OAuth2User.builder()
//                    .userId(user.getId())
//                    .oAuth2Name(dto.getOAuth2Name())
//                    .provider(dto.getProvider())
//                    .build();
//
//            oAuth2Service.join(oAuth2Mapper.save(oAuth2User));
//
//        } catch (Exception e) {
//            throw new SignupException(e.getMessage());
//        }
//
//        return RespOAuth2JoinDto.builder()
//                .message(".회원가입 완료!")
//                .user(user)
//                .build();
//    }
}

// 로그인 - checkUsernameAndPassword에서 검증 - user리턴 - 토큰 만들어야함
