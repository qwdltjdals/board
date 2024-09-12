import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import ReactPaginate from 'react-paginate';
import { css } from '@emotion/react';
import { useQuery } from 'react-query';
import { instance } from '../../apis/util/instance';
/** @jsxImportSource @emotion/react */

const paginateContainer = css`
    & > ul {
        list-style-type: none;
        display: flex;

        & > li {
            margin: 0px 5px;
        }

        & a {
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #dbdbdb;
            border-radius: 32px;
            padding: 0px 5px;
            min-width: 32px;
            height: 32px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        }

        & .active {
            border-radius: 32px;
            background-color: #bbbbbb;
            color: #ffffff;
        }
    }
`;

function NumberBoardListPage(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalPageCount, setTotalPageCount] = useState(1);
    const navigate = useNavigate();
    const limit = 10; // 한 페이지에 10개 들어가게 함

    const boardList = useQuery(
        ["boardListQuery", searchParams.get("page")],
        async () => await instance.get(`/board/list?page=${searchParams.get("page")}&limit=${limit}`), // params로 넘겨줌
        {
            retry: 0,
            onSuccess: response => setTotalPageCount(
                response.data.totalCount % limit === 0
                    ? response.data.totalCount / limit
                    : (response.data.totalCount / limit) + 1)
        }
    );

    const handlePageOnchange = (event) => {
        navigate(`/board/number?page=${event.selected + 1}`);
    }

    return (
        <div>
            <Link to={"/"}><h1>사이트 로고</h1></Link>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>추천수</th>
                        <th>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        boardList.isLoading
                            ?
                            <></>
                            :
                            boardList.data.data.boards.map(board => // boards = dto에서 만든거임
                                <tr key={board.id} onClick={() => navigate(`/board/detail/${board.id}`)}>
                                    <td>{board.id}</td>
                                    <td>{board.title}</td>
                                    <td>{board.writerName}</td>
                                    <td>{board.likeCount}</td>
                                    <td>{board.viewCount}</td>
                                </tr>
                            )
                    }
                </tbody>
            </table>
            <div css={paginateContainer}>
                <ReactPaginate
                    breakLabel="..."
                    previousLabel={<><IoMdArrowDropleft /></>}
                    nextLabel={<><IoMdArrowDropright /></>}
                    pageCount={totalPageCount - 1} // 전체 페이지 갯수 - 게시글 수에 따라 달라짐
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    activeClassName='active'
                    onPageChange={handlePageOnchange}
                    forcePage={parseInt(searchParams.get("page")) - 1} // 문자열이기 때문에 숫자로 바꿈 - 예는 인덱스로 받아와서 - 1
                />
            </div>
        </div>
    );
}

export default NumberBoardListPage;