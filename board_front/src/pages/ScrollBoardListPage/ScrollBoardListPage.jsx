/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import { IoMdHeart } from "react-icons/io";
import { useInfiniteQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../apis/util/instance";

const layout = css`
    margin: 0px auto;
    width: 1030px;
`;

const cardLayout = css`
    display: flex ;
    flex-wrap: wrap;
    border-top: 3px solid #dbdbdb;
    padding: 0;
    padding-top: 50px;
    width: 100%;
    list-style-type: none;
`;

const card = css`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    margin: 0px 0px 40px;
    width: 330px;
    height: 330px;
    box-shadow: 0px 3px 5px #00000011;
    cursor: pointer;
    transition: all 0.4s ease-in-out;

    &:nth-of-type(3n-1) {
        margin: 0px 20px 40px;
    }

    &:hover {
        transform: translateY(-5%);
        box-shadow: 0px 3px 10px #00000011;
    }
`;

const cardMain = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const cardImg = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 170px;
    overflow: hidden;

    & > img {
        width: 100%;
        background-color: #000000;
    }
`;

const cardContent = (isShowImg) => css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 10px;

    & > h3 { // 제목
        margin: 0px 0px 4px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; // 줄바꿈 안됨
    }

    & > div{ // 내용
        display: -webkit-box;
        overflow: hidden;
        word-break: break-all;
        -webkit-line-clamp: ${isShowImg ? 3 : 6};
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        & > * {
            margin: 0;
            font-size: 16px;
            font-weight: 400;
        }
    }
`;

const cardFooter = css`
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f5f5f5;
    padding: 0px 15px;
    height: 50px;

    & > div:nth-of-type(1) { // 유저이름
        display: flex;
        align-items: center;
        font-weight: 600;

        & > img {
            margin-right: 5px;
            border: 1px solid #dbdbdb;
            border-radius: 50%;
            width: 20px;
            height: 20px;
        }

        & > span {
            margin-right: 8px;
            font-weight: 400;
            font-size: 14px;
            color: #999999;
        }
    }

    & > div:nth-of-type(2) { // 좋아요
        display: flex;
        align-items: center;
    }
`;


function ScrollBoardListPage(props) {
    const navigate = useNavigate();

    const loadMoreRef = useRef(null);
    const pageRef = useRef(1);
    const [totalPageCount, setTotalPageCount] = useState(1);
    const limit = 20;

    const boardList = useInfiniteQuery(// 무한 스크롤 할 때 사용하는 쿼리 - 페이지 번호를 알아서 다음 다음 가져옴
        ["boardScrollQuery"],
        async ({ pageParam = 1 }) => await instance.get(`/board/list?page=${pageParam}&limit=${limit}`), // pageParam여기 값이 숫자면 요청 날아감 / 다른거면 요청 안날아감
        {
            getNextPageParam: (lastPage, allPage) => { // 페이지 들고오면 얘가 동작함
                const totalPageCount = lastPage.data.totalCount % limit === 0
                    ?
                    lastPage.data.totalCount / limit
                    :
                    Math.floor(lastPage.data.totalCount / limit) + 1;

                    return totalPageCount !== allPage.length ? allPage.length + 1 : null; // 토탈에 미치지 않으면(마지막 페이지가 아니면) 현재 페이지에 + 1해서 리턴 / 마지막 페이지면 그만
            }, // nextPage값이 = pageParam으로 들어감? - 리턴되어진 다음 페이지 번호
        }
    );

    // useInfiniteQuery 라이브러리 실행 - pageParam값이 바뀜 - 옵저버가 낚아챔 - nextPage를 pageParam으로 잡아줌 - 실행 - 마지막까지 실행

    useEffect(() => {
        if(!boardList.hasNextPage || !loadMoreRef.current) {
            return
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { // 스크롤하다가 loadMoreRef에 닿으면 isIntersecting을 true로 바꿈 - 스크롤이 올라가면서 false로 바뀜
                boardList.fetchNextPage(); // 함수 호출 시 재요청
            }
        }, { threshold: 1.0 }); // 콜백함수, 옵션

        observer.observe(loadMoreRef.current); // 감시하겠다. 저게 나오는지(loadMoreRef) - 이벤트가 일어나는 곳 - 

        return () => observer.disconnect(); // 언마운트 시점에 옵저버 객체 소멸
    }, [boardList.hasNextPage]); // 옵저버 세팅 다시

    return (
        <div css={layout}>
            <Link to={"/"}><h1>안갠차나</h1></Link>
            <h2 onClick={() => navigate("/board/write")}>글쓰기</h2>
            <ul css={cardLayout}>
                {
                    boardList.data?.pages.map(page => page.data.boards.map(board => {
                        const mainImgStartIndex = board.content.indexOf("<img");
                        let mainImg = board.content.slice(mainImgStartIndex);
                        mainImg = mainImg.slice(0, mainImg.indexOf(">") + 1); // 이미지 자른거에서 마지막까지 자르기
                        const mainImgSrc = mainImg.slice(mainImg.indexOf("src") + 5, mainImg.length - 2);//주소만 뺴옴 src="로 시작해서 + 5 / ">로 닫혀서 -2

                        let mainContent = board.content;

                        while (true) {
                            const pIndex = mainContent.indexOf("<p>");
                            if (pIndex === -1) {
                                mainContent = "";
                                break;
                            }
                            mainContent = mainContent.slice(pIndex + 3);
                            if (mainContent.indexOf("<img") !== 0) {
                                if (mainContent.includes("<img")) {
                                    mainContent = mainContent.slice(0, mainContent.indexOf("<img"));
                                    break;
                                }
                                mainContent = mainContent.slice(0, mainContent.indexOf("</p>"));
                                break;
                            }
                        }

                        return (
                            <li key={board.id} css={card} onClick={() => navigate(`/board/detail/${board.id}`)}>
                                <main css={cardMain}>
                                    {
                                        mainImgStartIndex != -1 &&
                                        <div css={cardImg}>
                                            <img src={mainImgSrc} alt="" />
                                        </div>
                                    }
                                    <div css={cardContent(mainImgStartIndex != -1)}>
                                        <h3>{board.title}</h3>
                                        <div dangerouslySetInnerHTML={{ __html: mainContent }}></div>
                                    </div>
                                </main>
                                <footer css={cardFooter}>
                                    <div>
                                        <img src={board.writerProfileImg} alt="" /> {/* 이미지가 없으면 랜더링 안됨*/}
                                        <span>by</span>
                                        {board.writerName}
                                    </div>
                                    <div><IoMdHeart /><span>{board.likeCount}</span></div>
                                </footer>
                            </li>
                        )
                    })) // map돌려서 page하나 꺼내서
                }
            </ul>
            <div ref={loadMoreRef}></div>
        </div>
    );
}

export default ScrollBoardListPage;