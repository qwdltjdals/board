import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import IndexPage from "./pages/IndexPage/IndexPage";
import UserJoinPage from "./pages/UserJoinPage/UserJoinPage";
import UserLoginPage from "./pages/UserLoginPage/UserLoginPage";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { instance } from "./apis/util/instance";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import OAuth2JoinPage from "./pages/OAuth2JoinPage/OAuth2JoinPage";
import OAuth2LoginPage from "./pages/OAuth2LoginPage/OAuth2LoginPage";
import WritePage from "./pages/boardPages/WritePage/WritePage";
import DetailPage from "./pages/boardPages/DetailPage/DetailPage";

function App() {

    const location = useLocation();
    const navigate = useNavigate();
    const [authRefresh, SetAuthRefresh] = useState(true);
    /**
     *  페이지 이동시 Auth(로그인, 토큰) 확인
     *  1. index(Home) 페이지를 먼저 들어가서 로그인 페이지로 들어간 경우 -> index로 이동
     *  2. 탭을 열자마자 주소창에 수동입력을 통해 로그인 페이지로 이도한 경우 -> index로 이동
     *  3. 로그인 후 사용 가능한 페이지로 들어갔을 때 로그인 페이지로 이동한 경우 -> 직전 페이지로 이동
     *  4. 로그인이 된 상태 -> 어느 페이지든 이동
     */

    useEffect(() => { // 마운트 이후 실행됨
        if (!authRefresh) {
            SetAuthRefresh(true);
        }
    }, [location.pathname]) // 주소값이 바뀌면 동작

    // 로그인 하면 로컬스토리지에 엑세스토큰 넣어두는거 - 로그인 유지하기 위해서
    const accessTokenValid = useQuery( // useQuery = 선언만 하면 동작함 - 알아서 요청 날린다? - 계속 값을 날리는 거
        ["accessTokenValidQuery"], // 키값 - 상태가 변했을때 요청 새로날린다
        async () => { // 요청메소드(펑션)
            SetAuthRefresh(false)
            console.log("쿼리에서 요청")
            return await instance.get("/auth/access", // 여기서 리턴이 정상적으로 이루어지면, onSuccess가 동작
                {
                    params: {
                        accessToken: localStorage.getItem("accessToken") // 로컬스토리지에 있는 이걸 넣어서 요청날림
                    }
                });
        }, { // 옵션 - 데이터 최신화하는 목적
        enabled: authRefresh, // true일때 요청 날아감
        retry: 0,
        refetchOnWindowFocus: false,
        onSuccess: response => {
            const permitAllPaths = ["/user"]; // 에러인 상태(로그아웃 상태)에서는 들어갈 수 없음
            for (let permitAllPath of permitAllPaths) {
                if (location.pathname.startsWith(permitAllPath)) { // pathname에 authPath 가 포함되어있니? - 인증 없이 어딘가에 들어가려고 시도함
                    alert("잘못된 접근입니다.")
                    navigate("/");

                    break;
                }
            }
        },
        onError: error => {
            const authPaths = ["/profile"]; // 에러인 상태(로그아웃 상태)에서는 들어갈 수 없음
            for (let authPath of authPaths) {
                if (location.pathname.startsWith(authPath)) { // pathname에 authPath 가 포함되어있니? - 인증 없이 어딘가에 들어가려고 시도함
                    navigate("/user/login");
                    break;
                }
            }
        }
    }
    );

    const userInfo = useQuery( // 키값, 요청메소드, 옵션
        ["userInfoQuery"],
        async () => {
            return await instance.get("/user/me")
        },
        {
            enabled: accessTokenValid.isSuccess // 위에 있는 토큰 검증이 트루여야만 함.
                && accessTokenValid.data?.data, // axios가 응답을 줘야만 마지막에 data가 생김 - true, false - 쓸 수 있는 토큰이라는 뜻
            refetchOnWindowFocus: false,
            //  onSuccess: response => { // 토큰이 들어오면 성공
            // },
            // onError: error => { // 토큰이 들어오지 않았음

            // }
        }
    );

    // console.log(accessTokenValid);
    // console.log("그냥출력")
    // console.log(accessTokenValid.data);

    // useEffect(() => {
    //     // const accessToken = localStorage.getItem("accessToken");
    //     // if (!!accessToken) { // 토큰 가지고 있으면
    //     //     setRefresh(true)
    //     // }
    //     console.log("Effect!!!");
    // }, [accessTokenValid.data])

    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/user/join" element={<UserJoinPage />} />
            <Route path="/user/join/oauth2" element={<OAuth2JoinPage />} />
            <Route path="/user/login" element={<UserLoginPage />} />
            <Route path="/user/login/oauth2" element={<OAuth2LoginPage />} />
            <Route path="/profile" element={<UserProfilePage />} />

            <Route path="/board" element={<></>} />
            <Route path="/board/write" element={<WritePage />} />
            <Route path="/board/detail/:boardId" element={<DetailPage />} />

            <Route path="/admin/*" element={<></>} />

            <Route path="/admin/*" element={<h1>Not Found</h1>} />
            <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
    );
}

export default App;




/**
 *      웹 소켓
 * httpProtocal - 물어봐야 답을 한다? = 단방향 통신
 * 웹소켓 - 요청과 응답의 개념이 없다 - 서로 요청? = 양방향 통신
 *      - 변경되면 그냥 받는다 - 채팅 등 실시간으로 처리되는거?
 * 
 * 
 */