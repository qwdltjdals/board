import { css } from '@emotion/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { singupApi } from '../../apis/signupApi';
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

const joinInfoBox = css`
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

const joinButton = css`
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

function UserJoinPage(props) {

    const navigate = useNavigate();

    const [inputUser, setInputUser] = useState({
        username : "",
        password : "",
        checkPassword : "",
        name : "",
        email : ""
    });

    const [fieldErrorMessages, setFieldErrorMessages] = useState({
        username : <></>,
        password : <></>,
        checkPassword : <></>,
        name : <></>,
        email : <></>
    });

    const handleInputUserChange = (e) => {
        setInputUser(inputUser => ({
            ...inputUser,
            [e.target.name] : e.target.value
    }));
}

    const handleJoinSubmitOnClick = async() => {
        const signupData = await singupApi(inputUser); // 버튼 누르면 Api로 가서 백엔드에 정보 넘겨줌
        if(!signupData.isSuccess) { // 로그인 실패하면?
            showFieldErrorMessage(signupData.fieldErrors);
            return;
        }
        navigate("/user/login");
    }

    const showFieldErrorMessage = (fieldErrors) => {
        let EmptyFieldErrors = { // 에러메시지 초기값
            username : <></>,
            password : <></>,
            checkPassword : <></>,
            name : <></>,
            email : <></>
        };

            for(let fieldError of fieldErrors) { // 포이치문
                EmptyFieldErrors = {
                    ...EmptyFieldErrors,
                    [fieldError.field] : <p>{fieldError.defaultMessage}</p> // 초기값이랑 매칭되는게 있으면 덮어써줌
                }
            }
        setFieldErrorMessages(EmptyFieldErrors);
    }

    return (
        <div css={layout}>
            <Link to={"/"}><h1 css={logo}>사이트 로고</h1></Link>
            <div css={joinInfoBox}>
                <div>
                    <input type="text" name='username' onChange={handleInputUserChange} value={inputUser.username} placeholder='아이디' />
                    {fieldErrorMessages.username}
                </div>
                <div>
                    <input type="password" name='password' onChange={handleInputUserChange} value={inputUser.password} placeholder='비밀번호' />
                    {fieldErrorMessages.password}
                </div>
                <div>
                    <input type="password" name='checkPassword' onChange={handleInputUserChange} value={inputUser.checkPassword} placeholder='비밀번호 확인' />
                    {fieldErrorMessages.checkPassword}
                </div>
                <div>
                    <input type="text" name='name' onChange={handleInputUserChange} value={inputUser.name} placeholder='성명' />
                    {fieldErrorMessages.name}
                </div>
                <div>
                    <input type="email" name='email' onChange={handleInputUserChange} value={inputUser.email} placeholder='이메일' />
                    {fieldErrorMessages.email}
                </div>
            </div>
            <button css={joinButton} onClick={handleJoinSubmitOnClick} >가입하기</button>
        </div>
    );
}

export default UserJoinPage;