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

function SearchBoardPage(props) {
    const [searchParams, setSearchParams] = useSearchParams(); // 주소에 파라미터 - 쿼리스트링 - 주소:포트/페이지URL?key=value
    const [totalPageCount, setTotalPageCount] = useState(1);
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
    const [searchOption, setSearchOption] = useState(searchParams.get("option") ?? "all");
    const limit = 10; // 한 페이지에 10개 들어가게 함

    const boardList = useQuery(
        ["boardListQuery", searchParams.get("page"), searchParams.get("option"), searchParams.get("search")], // 페이지의 값이 바뀌면 다시 요청 날려라
        async () => await instance.get(`/board/search?page=${searchParams.get("page")}&limit=${limit}&search=${searchValue}&option=${searchOption}`), // params로 넘겨줌 페이지 번호랑 리미트 보내줌
        {
            retry: 0,
            refetchOnWindowFocus: false,
            onSuccess: response => setTotalPageCount(
                response.data.totalCount % limit === 0
                    ? response.data.totalCount / limit
                    : Math.floor(response.data.totalCount / limit) + 1) // 소수점이 남아있음 - floor소수점 절삭
        }
    );

    // ? 를 기준으로 오른쪽이 서치파람 , 왼쪽이 파람
    // 페이지 번호나 보드번호 = 주로 그냥 useParams를 많이씀 but get요청일때, 옵션(변수)의 값이면 보통 뒤에 queryString으로 작성함 - searchParams

    const handleSearchOptionOnChange = (e) => {
        setSearchOption(e.target.value);
    }

    const handleSrarchInputOnChange = (e) => {
        setSearchValue(e.target.value);
    }

    const handleSrarchInputOnClick = () => {
        navigate(`/board/search?page=1&option=${searchOption}&search=${searchValue}`);
    }

    const handlePageOnchange = (e) => {
        navigate(`/board/search?page=${e.selected + 1}&option=${searchOption}&search=${searchValue}`); // 페이지 뒤에 주소만 바뀜 - 랜더링은 바뀌지 않음 - 페이지라고 하는 키값의 값이 바뀜
    }

    return (
        <div>
            <Link to={"/"}><h1>사이트 로고</h1></Link>
            <div>
                <select onChange={handleSearchOptionOnChange} value={searchOption}>
                    <option value="all">전체</option>
                    <option value="title">제목</option>
                    <option value="writer">작성자</option>
                </select>
                <input type="search" onChange={handleSrarchInputOnChange} value={searchValue} />
                <button onClick={handleSrarchInputOnClick}>검색</button>
            </div>
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
                            boardList.data?.data?.boards?.map(board => // boards = dto에서 만든거임
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
                    breakLabel="..." // 중간에 띄울 숫자
                    previousLabel={<><IoMdArrowDropleft /></>}
                    nextLabel={<><IoMdArrowDropright /></>}
                    pageCount={totalPageCount} // 전체 페이지 갯수 - 게시글 수에 따라 달라짐
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

export default SearchBoardPage;