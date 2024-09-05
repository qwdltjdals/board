import { css } from '@emotion/react';
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { oAuth2SignupApi, oauth2JoinApi, oauth2MergeApi } from '../../apis/oauth2Api';
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

const selectMenuBox = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
    & > input {
        display: none;
    }
    & > label {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        border: 1px solid #dbdbdb;
        height: 40px;
        cursor: pointer;
    }

    & > label:nth-of-type(1) {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    & > label:nth-last-of-type(1) {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    & > input:checked + label {
        background-color: #fafafa;
        box-shadow: 0px 0px 5px #00000033 inset;
    }
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

function OAuth2JoinPage(props) {

    const [selectMenu, SetselectMenu] = useState("merge");

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [inputUser, setInputUser] = useState({
        username: "",
        password: "",
        checkPassword: "",
        name: "",
        email: ""
    });

    const [fieldErrorMessages, setFieldErrorMessages] = useState({
        username: <></>,
        password: <></>,
        checkPassword: <></>,
        name: <></>,
        email: <></>
    });

    const handleInputUserChange = (e) => {
        setInputUser(inputUser => ({
            ...inputUser,
            [e.target.name]: e.target.value
        }));
    }



    const showFieldErrorMessage = (fieldErrors) => {
        let EmptyFieldErrors = { // 에러메시지 초기값
            username: <></>,
            password: <></>,
            checkPassword: <></>,
            name: <></>,
            email: <></>
        };

        for (let fieldError of fieldErrors) { // 포이치문
            EmptyFieldErrors = {
                ...EmptyFieldErrors,
                [fieldError.field]: <p>{fieldError.defaultMessage}</p> // 초기값이랑 매칭되는게 있으면 덮어써줌
            }
        }
        setFieldErrorMessages(EmptyFieldErrors);
    }

    const handleMergeSubmitOnClick = async () => {
        const mergeUser = {
            username: inputUser.username,
            password: inputUser.password,
            oauth2Name: searchParams.get("oAuth2Name"),
            provider: searchParams.get("provider")
        }
        const mergeData = await oauth2MergeApi(mergeUser);
        if(!mergeData.isSuccess) {
            if(mergeData.errorStatus === "loginError") {
                alert(mergeData.error);
                return;
            }
            if(mergeData.errorStatus === "fieldError") {
                showFieldErrorMessage(mergeData.error);
                return;
            }
        }
        alert("계정 통합이 완료되었습니다");
        navigate("/user/login");
    }

    const handleJoinSubmitOnClick = async () => {
        const joinUser = {
            ...inputUser,
            oauth2Name: searchParams.get("oAuth2Name"),
            provider: searchParams.get("provider")
        }

        const signupData = await oAuth2SignupApi(joinUser);
        if(!signupData.isSuccess) {
            showFieldErrorMessage(signupData.fieldErrors);
            return;
        }
        alert("회원가입이 완료되었습니다");
        navigate("/user/login");
    }

    const handleSelectMenu = (e) => {
        setInputUser({
            username: "",
            password: "",
            checkPassword: "",
            name: "",
            email: ""
        });
        setFieldErrorMessages({
            username: <></>,
            password: <></>,
            checkPassword: <></>,
            name: <></>,
            email: <></>
        })
        SetselectMenu(e.target.value);
    }

    return (
        <div css={layout}>
            <Link to={"/"}><h1 css={logo}>사이트 로고</h1></Link>
            <div css={selectMenuBox}>
                <input type="radio" id='merge' name='selectMenu'
                    onChange={handleSelectMenu}
                    checked={selectMenu === "merge"} value="merge" />
                <label htmlFor="merge">계정통합</label>

                <input type="radio" id="join" name='selectMenu'
                    onChange={handleSelectMenu}
                    checked={selectMenu === "join"} value="join" />
                <label htmlFor="join">회원가입</label>
            </div>
            {
                selectMenu === "merge"
                    ?
                    <>
                        <div css={joinInfoBox}>
                            <div>
                                <input type="text" name='username' onChange={handleInputUserChange} value={inputUser.username} placeholder='아이디' />
                                {fieldErrorMessages.username}
                            </div>
                            <div>
                                <input type="password" name='password' onChange={handleInputUserChange} value={inputUser.password} placeholder='비밀번호' />
                                {fieldErrorMessages.password}
                            </div>
                        </div>
                        <button css={joinButton} onClick={handleMergeSubmitOnClick} >통합하기</button>
                    </>
                    :
                    <>
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
                    </>
            }
        </div>
    );
}

export default OAuth2JoinPage;