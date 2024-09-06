/** @jsxImportSource @emotion/react */

import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { instance } from "../../../apis/util/instance";
import { css } from "@emotion/react";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { GoHeart } from "react-icons/go";

const layout = css`
    box-sizing: border-box;
    margin: 50px auto 0px;
    width: 1100px;
`;

const header = css`
    box-sizing: border-box;
    border: 1px solid #dbdbdb;
    padding: 10px 15px;
    & > h1 {
        margin: 0;
        margin-bottom: 15px;
        font-size: 38px;
        cursor: default;
    }
`;

const titleAndLike = css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;

        background-color: #ffffff;

        & > svg {
            font-size: 30px;
        }
    }
`;

const boardInfoContainer = css`
    display: flex;
    justify-content: space-between;

    & span {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: default;
    }

    & button {
        box-sizing: border-box;
        border: 1px solid #dbdbdb;
        margin-left: 5px;
        padding: 5px 15px;
        background-color: white;
        font-size: 12px;
        font-weight: 600;
        color: #333333;
        cursor: pointer;

        &:hover {
            background-color: #fafafa;
        }

        &:active {
            background-color: #eeeeee;
        }
    }
`;

const contentBox = css`
    box-sizing: border-box;
    margin-top: 5px;
    border: 1px solid #dbdbdb;
    padding: 12px 15px;
    & img:not(img[width]) { // 크기조절을 했으면 이미지에 width속성이 있을거임
        width: 100%;
    }
`;

function DetailPage(props) {
    const navigate = useNavigate();
    const params = useParams();
    const boardId = params.boardId;
    const quaryClient = useQueryClient();
    const userInfoData = quaryClient.getQueryData("userInfoQuery")

    const board = useQuery(
        ["boardQuary", boardId], // 키값, boardId가 바뀌면 다시 랜더링
        async () => { // 요청 - 함수
            return instance.get(`/board/${boardId}`); // boardId = params에서 가져옴
        },
        {
            refetchOnWindowFocus: false,
            retry: 0,
            // onSuccess: response => { // 응답이 오면
            //     console.log(response)
            // },
            // onError: error => { // 근데 에러면??

            // }
        }

    ); // 리엑트 쿼리

    // 서버 스테이트는 리엑트쿼리로 관리를 하겠다!
    // 클라이언트 스테이트는 useState나 recoil로 관리하겠다!
    //혹은
    // 리엑트쿼리 = 전역 상태
    // 단점 - 랜더링 되어있는 동안에 메모리를 계속 사용함
    // 전역상태를 무분별하게 쓰면 사이트가 무거워짐


    const boardLike = useQuery(
        ["boardLikeQuery"],
        async () => {
            return instance.get(`/board/${boardId}/like`)
        },
        {
            refetchOnWindowFocus: false,
            retry: 0,
        }
    );

    const likeMutation = useMutation (
        async () => {
            return await instance.post(`/board/${boardId}/like`);// 첫번재꺼 : 매개변수 / 그다음 함수
        },
        {
            onSuccess: response => {
                boardLike.refetch(); // 보드라이크 다시 실행 - 뮤테이션 동작 후에
            }
        }
    );

    const disLikeMutation = useMutation (
        async () => {
            return await instance.delete(`/board/like/${boardLike.data?.data.boardLikeId}`);// 첫번재꺼 : 매개변수 / 그다음 함수
        },
        {
            onSuccess: response => {
                boardLike.refetch(); // 보드라이크 다시 실행 - 뮤테이션 동작 후에
            }
        }
    );

    const handleLikeOnClick = () => {
        if (!userInfoData?.data) {
            if (window.confirm("로그인 후 이용가능합니다. 로그인 페이지로 이동하시겠습니까?")) {
                navigate("/user/login")
            }
            return;
        }
        likeMutation.mutateAsync(); // 이때 호출됨
    }

    const handleDisLikeOnClick = () => {
        disLikeMutation.mutateAsync();
    }


        return (
            <div css={layout}>
                <Link to={"/"}><h1>사이트 로고</h1></Link>
                {
                    board.isLoading && <></>
                }
                {
                    board.isError && <h1>{board.error.response.data}</h1>
                }
                {
                    board.isSuccess &&
                    <>
                        <div css={header}>
                            <div css={titleAndLike}>
                                <h1>{board.data.data.title}</h1>
                                <div>
                                    {
                                        !!boardLike?.data?.data?.boardLikeId
                                        ?
                                        <button onClick={handleDisLikeOnClick}>
                                        <IoMdHeart />
                                    </button>
                                    :
                                    <button onClick={handleLikeOnClick}>
                                        <IoMdHeartEmpty />
                                    </button>
                                    }
                                </div>
                            </div>
                            <div css={boardInfoContainer}>
                                <span>
                                    작성자 : {board.data.data.writerUsername}
                                </span>
                                <span>
                                    조회수 : {board.data.data.viewCount}
                                </span>
                                <span>
                                    추천수 : {boardLike?.data?.data.likeCount}
                                </span>
                                <div>
                                    {
                                        board.data.data.writerId === userInfoData?.data.userId &&
                                        <>
                                            <button>수정</button>
                                            <button>삭제</button>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                        <div css={contentBox} dangerouslySetInnerHTML={{
                            __html: board.data.data.content
                        }}>

                        </div>
                    </>
                }
            </div>


        );
    }

    export default DetailPage;