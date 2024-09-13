import { css } from '@emotion/react';
import React from 'react';
import { useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
/** @jsxImportSource @emotion/react */


const layout = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 100px 300px;
`;

const header = css`
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
    & > input {
        box-sizing: border-box;
        width: 50%;
        height: 50px;
        border-radius: 50px;
        padding: 10px 20px;
    }
`;
const main = css`
    display: flex;
    justify-content: space-between;
`;

const leftBox = css`
    box-sizing: border-box;
    border: 2px solid #dbdbdb;
    border-radius: 10px;
    width: 64%;
`;

const rightBox = css`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid #dbdbdb;
    border-radius: 10px;
    width: 35%;
    padding: 20px;

    & > button{
        margin-bottom: 10px;
        width: 100%;
        height: 40px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
    }

    & > div {
        display: flex;
        justify-content: center;
        width: 100%;

        & > a:not(:nth-last-of-type(1))::after { // a = Link 테그 마지막에 첫번째 녀석이 아니면 다음에 이거 넣어라
            display: inline-block;
            content: "";
            margin: 0px 5px;
            height: 60%;
            border-left: 1px solid #222222;
        }
    }


`;

const userInfoBox = css`
    display: flex;
    justify-content: flex-start;
    width: 100%;
`;

const profileImgBox = css`
box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    box-shadow: 0px 0px 2px #00000088;
    cursor: pointer;
    overflow: hidden;
    & > img {
        height: 100%;
    }
`;

const profileInfo = css`
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    padding: 10px;

    & > button {
        box-sizing: border-box;
        border: 1px solid #dbdbdb;
        border-radius: 37px;
        padding: 5px 10px;
        height: 37px;
        background-color: #ffffff;
        color: #555555;
        font-size: 16px;
        cursor: pointer;
    }
`;

function IndexPage(props) {
    const navigate = useNavigate();
    const queryClint = useQueryClient();
    const accessTokenValidState = queryClint.getQueryState("accessTokenValidQuery");
    const userInfoState = queryClint.getQueryState("userInfoQuery");

    // queryClint.invalidateQueries() // 지금까지 가져온 쿼리들 만료 - 후 다시 가져옴

    const haneldLoginOnClick = () => {
        navigate("/user/login");
    }

    const handleLogOutButtonClick = () => {
        localStorage.removeItem("accessToken"); // 로컬스토리지에 토큰 날리는거
        window.location.replace("/");
    }
    return (
        <div css={layout}>
            <header css={header}>
                <input type="search" placeholder='검색어를 입력해 주세요.' />
            </header>

            <main css={main}>
                <div css={leftBox}>
                    <Link to={"/board/number?page=1"}>게시글</Link>
                    <Link to={"/board/scroll"}>게시글</Link>
                    <Link to={"/board/write"}>글쓰기</Link>
                </div>
                {
                    accessTokenValidState.status !== "success"
                        ?
                        accessTokenValidState.status !== "error"
                            ? // idle이거나 로딩중이거나
                            <></>
                            : // error일떄 - 석세스가 아닌데 에러일떄
                            <div css={rightBox}>
                                <p>더 안전하고 편리하게 이용하세요</p>
                                <button onClick={haneldLoginOnClick}>로그인</button>
                                <div>
                                    <Link to={"/user/help/id"}>아이디 찾기</Link>
                                    <Link to={"user/help/pw"}>비밀번호 찾기</Link>
                                    <Link to={"user/join"}>회원가입</Link>
                                </div>
                            </div>
                        : // 석세스
                        <div css={rightBox}>
                            <div css={userInfoBox}>
                                <div css={profileImgBox} onClick={() => navigate("/profile")}>
                                    <img src={userInfoState.data?.data.img} alt="" />
                                </div>
                                <div css={profileInfo}>
                                    <div>
                                        <div>{userInfoState.data?.data.username}님</div>
                                        <div>{userInfoState.data?.data.email}</div>
                                    </div>
                                    <button onClick={handleLogOutButtonClick}>로그아웃</button>
                                </div>
                            </div>
                        </div>
                }
            </main>
        </div>
    );
}
export default IndexPage;