import { css } from '@emotion/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signinApi } from '../../apis/signinApi';
import { instance } from '../../apis/util/instance';
/** @jsxImportSource @emotion/react */

const layout = css`
    display: flex;
    flex-direction: column;
    margin: 0px auto;
    width: 460px;
`;

const logo = css`
    font-size: 24px;
    margin-bottom: 40px;
`;

const loginInfoBox = css`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 100%;

    & input {
        box-sizing: border-box;
        border: none;
        outline: none;
        width: 100%;
        height: 50px;
        font-size: 16px;
    }

    & p {
        margin: 0px 0px 10px;
        color: #ff2f2f;
        font-size: 12px;
    }

    & > div {
        box-sizing: border-box;
        width: 100%;
        border: 1px solid #dbdbdb;
        border-bottom: none;
        padding: 0px 20px;
    }

    & > div:nth-of-type(1) {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    & > div:nth-last-of-type(1) {
        border-bottom: 1px solid #dbdbdb;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`;

const loginButton = css`
    border: none;
    border-radius: 10px;
    width: 100%;
    height: 50px;
    background-color: #999999;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
`;

function UserLoginPage(props) {

    const navigate = useNavigate();

    const [inputUser, setInputUser] = useState({
        username : "",
        password : "",
    });

    const [fieldErrorMessages, setFieldErrorMessages] = useState({
        username : <></>,
        password : <></>,
    });

    const handleInputUserChange = (e) => {
        setInputUser(inputUser => ({
            ...inputUser,
            [e.target.name] : e.target.value
    }));
}

const showFieldErrorMessage = (fieldErrors) => {
    let EmptyFieldErrors = { // 에러메시지 초기값
        username : <></>,
        password : <></>,
    };

        for(let fieldError of fieldErrors) { // 포이치문
            EmptyFieldErrors = {
                ...EmptyFieldErrors,
                [fieldError.field] : <p>{fieldError.defaultMessage}</p> // 초기값이랑 매칭되는게 있으면 덮어써줌
            }
        }
    setFieldErrorMessages(EmptyFieldErrors);
}

const handleLoginSubmitOnClick = async() => {
    const signinData = await signinApi(inputUser);
    if(!signinData.isSuccess) { // 로그인 실패하면?
        if(signinData.errorStatus === 'fieldError') {
            showFieldErrorMessage(signinData.error);
        }
        if(signinData.errorStatus === 'loginError') {
            let EmptyFieldErrors = { // 에러메시지 초기값
                username : <></>,
                password : <></>,
            };
            setFieldErrorMessages(EmptyFieldErrors);
            alert(signinData.error);
        }
        return;
    }
    localStorage.setItem("accessToken", "Bearer " + signinData.token.accessToken); // 로그인 성공하면 accessToken 집어넣음

    instance.interceptors.request.use(config => { // 요청때 config 설정 사용해라
        config.headers["Authorization"] = localStorage.getItem("accessToken") // 처음에 로그인이 안되어있으면 null값 들어가 있음
        return config;
    });

    // alert(signinData.successMessage);

    if(window.history.length > 2) {
        navigate(-1); // 뒤로가기
        return;
    }
    navigate("/");
}

    return (
        <div css={layout}>
            <Link to={"/"}><h1 css={logo}>사이트 로고</h1></Link>
            <div css={loginInfoBox}>
                <div>
                    <input type="text" name='username' onChange={handleInputUserChange} value={inputUser.username} placeholder='아이디' />
                    {fieldErrorMessages.username}
                </div>
                <div>
                    <input type="password" name='password' onChange={handleInputUserChange} value={inputUser.password} placeholder='비밀번호' />
                    {fieldErrorMessages.password}
                </div>
            </div>
            <button css={loginButton} onClick={handleLoginSubmitOnClick}>로그인</button>
            <a href="http://localhost:8080/oauth2/authorization/google">구글 로그인</a>
            <a href="http://localhost:8080/oauth2/authorization/naver">네이버 로그인</a>
            <a href="http://localhost:8080/oauth2/authorization/kakao">카카오 로그인</a>
        </div>
    );
}

export default UserLoginPage;