/** @jsxImportSource @emotion/react */

import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, Route, useNavigate, useParams } from "react-router-dom";
import { instance } from "../../../apis/util/instance";
import { css } from "@emotion/react";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { GoHeart } from "react-icons/go";
import { useEffect, useState } from "react";
import BoardModifyPage from "../BoardModifyPage/BoardModifyPage";

const layout = css`
    box-sizing: border-box;
    margin: 50px auto 300px;
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

const commentContainor = css`
    margin-bottom: 50px;
`;

const commentWriteBox = (level) => css`
    display: flex;
    box-sizing: border-box;
    margin-top: 5px;
    margin-left: ${level * 3}%;
    height: 80px;

    & > textarea {
        flex-grow: 1;
        margin-right: 5px;
        border: 1px solid #dbdbdb;
        outline: none;
        padding: 12px 15px;
        resize: none;
    }

    & > button {
        box-sizing: border-box;
        border: 1px solid #dbdbdb;
        width: 80px;
        background-color: #ffffff;
        cursor: pointer;
    }
`;

const commentListContainer = (level) => css`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-left: ${level * 3}%;
    border-bottom: 1px solid #dbdbdb;
    padding: 12p 15px;

    & > div:nth-of-type(1) {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
        width: 70px;
        height: 70px;
        overflow: hidden;
        border: 1px solid #dbdbdb;
        border-radius: 50px;

        & > img {
            height: 100%;
        }
    }
`;

const commentDetail = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const detailHeader = css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;

    & > span:nth-of-type(1) {
        font-weight: 600;
        cursor: default;
    }
`;

const detailContents = css`
    margin-bottom: 10px;
    max-height: 50px;
    overflow-y: auto;
`;

const detailButtons = css`
    display: flex;
    justify-content: flex-end;
    width: 100%;

    &  button {
        box-sizing: border-box;
        margin-left: 4px;
        border: 1px solid #dbdbdb;
        background-color: #ffffff;
        padding: 5px 10px;
        cursor: pointer;
    }

`;

function DetailPage(props) {
    const navigate = useNavigate();
    const params = useParams();
    const boardId = params.boardId;
    const quaryClient = useQueryClient();
    const userInfoData = quaryClient.getQueryData("userInfoQuery");

    const [selectedCommentId, setSelectedCommentId] = useState(null);

    const [commentData, setCommentData] = useState({
        boardId, // 변수랑 키값이랑 같으면 생략이 가ㅡㄴㅇ하다.
        parentId: null,
        content: "",
    });

    const [commentModifyData, setCommentModifyData] = useState({
        commentId: 0,
        content: "",
    });

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
    );



    // useEffect(() => {
    //     if (board.isSuccess && board.data.data) {
    //         setBoardModifyData({
    //             boardId: board.data.data.boardId,
    //             title: board.data.data.title,
    //             content: board.data.data.content,
    //         });
    //     }
    // }, [board.isSuccess, board.data]);

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

    const comments = useQuery(
        ["commentsQuery"],
        async () => {
            return await instance.get(`/board/${boardId}/comments`)
        },
        {
            retry: 0,
        }
    );

    // const modify = useQuery(
    //     ["modifyQuery"],
    //     async () => {
    //         return await instance.get(`/board/${boardId}`)
    //     },
    //     {
    //         retry: 0,
    //     }
    // );

    // 리엑트 쿼리

    // 서버 스테이트는 리엑트쿼리로 관리를 하겠다!
    // 클라이언트 스테이트는 useState나 recoil로 관리하겠다!
    //혹은
    // 리엑트쿼리 = 전역 상태
    // 단점 - 랜더링 되어있는 동안에 메모리를 계속 사용함
    // 전역상태를 무분별하게 쓰면 사이트가 무거워짐

    const likeMutation = useMutation(
        async () => {
            return await instance.post(`/board/${boardId}/like`);// 첫번재꺼 : 매개변수 / 그다음 함수
        },
        {
            onSuccess: response => {
                boardLike.refetch(); // 보드라이크 다시 실행 - 뮤테이션 동작 후에
            }
        }
    );

    const disLikeMutation = useMutation(
        async () => {
            return await instance.delete(`/board/like/${boardLike.data?.data.boardLikeId}`);// 첫번재꺼 : 매개변수 / 그다음 함수
        },
        {
            onSuccess: response => {
                boardLike.refetch(); // 보드라이크 다시 실행 - 뮤테이션 동작 후에
            }
        }
    );

    // 리엑트 쿼리는 왜?
    // useQuery = get요청 - 자동으로 가져올때, refetch할때 쓰는거 - 요청, 응답 관리해주는거 - 요청 응답을 하는게 아님! - 활용하기 위해 쓰는거
    // axios의 요청과 응답을 관리해 주는게 리엑트 쿼리
    // client state에서는 recoil을 씀
    const commentMutation = useMutation( // Mutation - post put delete할때 씀 - 내가 원할 때 mutate라는 메소드를 호출해서 동작하게 만드는 거
        async () => {
            return await instance.post("/board/comment", commentData);
        },
        {
            onSuccess: response => {
                console.log(response)
                alert("댓글 작성이 완료되었습니다.");
                setCommentData({
                    boardId, // 변수랑 키값이랑 같으면 생략이 가ㅡㄴㅇ하다.
                    parentId: null,
                    content: "",
                })
                comments.refetch(); // 리패치 : useQueryClient를 안쓰고 useQuery를 씀 - 같은 위치에 이게 있어야함
                // 자식요소에서 리패치 하고 싶은 경우 - useQueryClient에서 인벨리테이트
            }
        }
    );

    const modifyCommentUpdateMutation = useMutation(
        async () => await instance.put(`/board/comment/${commentModifyData.contentcommentId}`, commentModifyData), // 매개변수가 아니라 상태를 직접적으로 넣음
        {
            onSuccess: () => {
                alert("댓글 수정이 완료되었습니다.");
                setCommentModifyData({ // 값들 다시 초기화 시킴
                    contentId: 0,
                    content: "",
                });
                comments.refetch();
            }
        }
    )

    const deleteCommentMutation = useMutation(
        async (commentId) => await instance.delete(`/board/comment/${commentId}`), // mutateAsync에 넣어주면 들어감(commentId)
        {
            onSuccess: responce => {
                alert("댓글을 삭제하였습니다.");
                comments.refetch();
            }
        },
    )

    const deleteBoardMutation = useMutation(
        async (boardId) => await instance.delete(`/board/delete/${boardId}`),
        {
            onSuccess: responce => {
                alert("삭제가 완료되었습니다");
            }
        }
    )

    const handleLikeOnClick = () => {
        if (!userInfoData?.data) {
            if (window.confirm("로그인 후 이용가능합니다. 로그인 페이지로 이동하시겠습니까?")) {
                navigate("/user/login")
            }
            return;
        }
        likeMutation.mutateAsync(); // 이때 호출됨
    };

    const handleDisLikeOnClick = () => {
        disLikeMutation.mutateAsync();
    };

    const handleCommentInputOnChange = (e) => {
        setCommentData(commentData => ({
            ...commentData,
            [e.target.name]: e.target.value
        }));
    }

    const handleModifyInputOnChange = (e) => {
        setCommentModifyData(commentData => ({
            ...commentData,
            [e.target.name]: e.target.value
        }));
    }

    const handleCommentSubmitOnClick = () => { // 등록하기 버튼 누름
        if (!userInfoData?.data) {
            if (window.confirm("로그인 후 이용가능합니다. 로그인 페이지로 이동하시겠습니까?")) {
                navigate("/user/login")
            }
            return;
        }
        commentMutation.mutateAsync();
    }

    const handleCommentModifySubmitOnClick = () => { // 수정하기 버튼 누름
        modifyCommentUpdateMutation.mutateAsync();
    }

    const handleReplyButtonOnClick = (commentId) => {
        setCommentData(commentdata => ({
            boardId, // 변수랑 키값이랑 같으면 생략이 가ㅡㄴㅇ하다.
            parentId: commentId === commentData.parentId ? null : commentId,
            content: "",
        }));
    }

    const handleModifyCommentButtonOnClick = (commentId, content) => {
        setCommentModifyData(commentData => ({
            commentId,
            content
        }));
    }

    const handleModifyCommentCancleButonOnClick = () => {
        setCommentModifyData(commentData => ({
            commentId: 0,
            content: ""
        }));
    }

    const handleDeleteCommentButtonOnClick = (commentId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            deleteCommentMutation.mutateAsync(commentId);
        }
    }

    const handleModifyButtonOnClick = () => {
        if (window.confirm("수정하시겠습니까?")) {

            navigate(`/board/modify/${boardId}`)
        }
    }

    const handleDeleteSubmitButtonOnClick = (boardId) => {
        if(window.confirm("정말 삭제하시겠습니까?")) {
            deleteBoardMutation.mutateAsync(boardId)
            navigate("/board/scroll")
        }
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
                                        <button onClick={handleModifyButtonOnClick}>수정</button>
                                        <button onClick={() => handleDeleteSubmitButtonOnClick(boardId)}>삭제</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div css={contentBox} dangerouslySetInnerHTML={{
                        __html: board.data.data.content
                    }}>

                    </div>
                    <div css={commentContainor}>
                        <h2>댓글 {comments?.data?.data.commentCount}</h2>
                        {
                            commentData.parentId === null &&
                            <div css={commentWriteBox(0)}>
                                <textarea name="content" onChange={handleCommentInputOnChange} value={commentData.content} placeholder="댓글 내용을 입력해 주세요"></textarea>
                                <button onClick={handleCommentSubmitOnClick}>작성하기</button>
                            </div>
                        }

                        <div>
                            {
                                comments.data?.data.comments.map(comment =>  // 가지고온거 = 처음 data / dto = 두번째 data
                                    <div key={comment.id} >
                                        <div css={commentListContainer(comment.level)}>
                                            <div>
                                                <img src={comment.img} alt="" />
                                            </div>
                                            <div css={commentDetail}>
                                                <div css={detailHeader}>
                                                    <span>{comment.username} </span>
                                                    <span> {new Date(comment.createDate).toLocaleString()}</span>
                                                </div>
                                                <pre css={detailContents}>{comment.content}</pre>
                                                <div css={detailButtons}>
                                                    {
                                                        userInfoData?.data?.userId === comment.writerId &&
                                                        <div>
                                                            {
                                                                commentModifyData.commentId === comment.id
                                                                    ?
                                                                    <button onClick={handleModifyCommentCancleButonOnClick}>취소</button>
                                                                    :
                                                                    <button onClick={() => handleModifyCommentButtonOnClick(comment.id, comment.content)}>수정</button>
                                                            }
                                                            <button onClick={() => handleDeleteCommentButtonOnClick(comment.id)}>삭제</button>
                                                        </div>
                                                    }
                                                    {
                                                        comment.level < 3 &&
                                                        <div>
                                                            <button onClick={() => handleReplyButtonOnClick(comment.id)}>답글</button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            commentData.parentId === comment.id &&
                                            <div css={commentWriteBox(comment.level)}>
                                                <textarea name="content" onChange={handleCommentInputOnChange} value={commentData.content} placeholder="댓글 내용을 입력해 주세요" ></textarea>
                                                <button onClick={handleCommentSubmitOnClick}>작성하기</button>
                                            </div>
                                        }
                                        {
                                            commentModifyData.commentId === comment.id &&
                                            <div css={commentWriteBox(comment.level)}>
                                                <textarea name="content" onChange={handleModifyInputOnChange} value={commentModifyData.content} placeholder="댓글 내용을 입력해 주세요" ></textarea>
                                                <button onClick={handleCommentModifySubmitOnClick}>수정하기</button>
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default DetailPage;