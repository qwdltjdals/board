/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';
import ImageResize from "quill-image-resize";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from 'uuid';
import { RingLoader } from "react-spinners";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { instance } from "../../../apis/util/instance";
import { storage } from "../../../firebase/firebase";
import { useMutation, useQuery, useQueryClient } from "react-query";


Quill.register("modules/imageResize", ImageResize);


const layout = css`
    box-sizing: border-box;
    padding-top: 30px;
    margin: 0 auto;
    width: 1100px;
`;

const header = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 10px 0px;

    & > h1 {
        margin: 0;
    }

    & > button {
        box-sizing: border-box;
        border: 1px solid #c0c0c0;
        padding: 6px 15px;
        background-color: white;
        font-size: 12px;
        color: #333333;
        font-weight: 600;
        cursor: pointer;
        &:hover {
            background-color: #fafafa;
        }
        &:active {
            background-color: #eeeeee;
        }
    }
`;

const titleInput = css`
    box-sizing: border-box;
    margin-bottom: 10px;
    border: 1px solid #c0c0c0;
    outline: none;
    padding: 12px 15px;
    width: 100%;
    font-size: 16px;
`;

const editerLayout = css`
    box-sizing: border-box;
    margin-bottom: 42px; // 위에 박스 만큼 밀어내고 있어서 이것도 밀어내줘야함
    width: 100%;
    height: 700px;

`;

const loadingLayout = css`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #00000066;
`;

function BoardModifyPage() {
    const navigate = useNavigate();
    const params = useParams();
    const boardId = params.boardId;
    const quaryClient = useQueryClient();
    const userInfoData = quaryClient.getQueryData("userInfoQuery");

    const [board, setBoard] = useState({
        boardId: "",
        title: "",
        content: ""
    });

    const boardQuery = useQuery(
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


    const modify = useMutation(
        ["boardQuary"], // 키값, boardId가 바뀌면 다시 랜더링
        async () => { // 요청 - 함수
            return instance.put(`/board/modify/${boardId}`, board); // boardId = params에서 가져옴
        },
        {
            refetchOnWindowFocus: false,
            retry: 0,
        }
    );

    const quillRef = useRef(null);
    const [isUploading, setUploading] = useState(false);

    const handleWriteSubmitOnClick = async () => {
        try {
            const response = await instance.put(`/board/modify/${boardId}`, board) // await이 있어야 resolve데이터가 response에 담김
            alert("작성이 완료되었습니다.")
            navigate(`/board/detail/${response.data.boardId}`) // 컨트롤러에서 응답받은 키값   
        } catch (error) { // await에서 뜬 error 받아옴
            const fieldErrors = error.response.data;

            for (let fieldError of fieldErrors) {
                if (fieldError.field === "title") {
                    alert(fieldError.defaultMessage);
                    return; // alert창 두개 이상 뜨는거 방지
                }
            }
            for (let fieldError of fieldErrors) {
                if (fieldError.field === "content") {
                    alert(fieldError.defaultMessage);
                    return;
                }
            }

        }
    }

    // const handleWriteSubmitOnClick2 = async () => {
    //     // const response = await addWriteApi(board);
    //     let response = null
    //     try {
    //         response = await instance.post("/board", board)
    //         alert("작성이 완료되었습니다.")
    //         navigate(`/board/detail/${response.data.boardId}`) // 컨트롤러에서 응답받은 키값
    //     } catch (error) {
    //         const fieldErrors = error.response.data;

    //         for (let fieldError of fieldErrors) {
    //             if (fieldError.field === "title") {
    //                 alert(fieldError.defaultMessage);
    //                 return; // alert창 두개 이상 뜨는거 방지
    //             }
    //         }
    //         for (let fieldError of fieldErrors) {
    //             if (fieldError.field === "content") {
    //                 alert(fieldError.defaultMessage);
    //                 return;
    //             }
    //         }
    //     }
    //     // .then((response) => {
    //     //     // response.data = 응답 객체
    // };

    const handletitleInputOnchange = (e) => {
        setBoard(board => ({
            ...board,
            [e.target.name]: e.target.value
        }));
    }

    const handleQuillValueOnChange = (value) => {
        setBoard(board => ({
            ...board,
            content: quillRef.current.getEditor().getText().trim() === "" ? "" : value,
        }));
    }

    const handleImageLoad = useCallback((e) => { // 랜더링 될때 다시 재정의 하지 않을때 쓰는거
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.click();

        input.onchange = () => {
            const editor = quillRef.current.getEditor();
            const files = Array.from(input.files); // 이미지 불러옴
            const imgFile = files[0];

            const editPoint = editor.getSelection(true);

            const storageRef = ref(storage, `board/img/${uuid()}_${imgFile.name}`)
            const task = uploadBytesResumable(storageRef, imgFile);
            setUploading(true)
            task.on(
                "state_changed",
                () => { },
                () => { },
                async () => {
                    const url = await getDownloadURL(storageRef);
                    editor.insertEmbed(editPoint.index, "image", url) // 현재 커서 위치에 이미지 추가해라 - url로
                    editor.setSelection(editPoint.index + 1); // 현재 커서 위치 다음으로 커서를 위치시켜라
                    editor.insertText(editPoint.index + 1, "\n");
                    setUploading(false)
                    setBoard(board => ({ // 이미지만 넣고(글 안넣고) 작성버튼 눌러도 되게하는거
                        ...board,
                        content: editor.root.innerHTML,
                    }));
                }
            )

        }
    }, []);

    const toolbarOptions = useMemo(() => [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'color': [] }, { 'background': [] }, { 'align': [] }],          // dropdown with defaults from theme
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        ['link', 'image', 'video', 'formula'],
        ['blockquote', 'code-block'],
    ], []);


    return (
        <div css={layout}>
            <header css={header}>
                <h1>Quill Edit</h1>
                <button onClick={handleWriteSubmitOnClick}>작성하기</button>
            </header>
            <input css={titleInput} type="text" name="title" onChange={handletitleInputOnchange} defaultValue={boardQuery?.data?.data?.title} />
            <div css={editerLayout}>
                {
                    isUploading &&
                    <div css={loadingLayout}>
                        <RingLoader />
                    </div>
                }
                <ReactQuill
                    ref={quillRef}
                    style={{
                        boxSizing: "border-box",
                        width: "100%",
                        height: "100%"
                    }}
                    onChange={handleQuillValueOnChange}
                    defaultValue={boardQuery?.data?.data?.content}
                    modules={{
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                image: handleImageLoad,
                            }
                        },
                        imageResize: {
                            Parchment: Quill.import("parchment")
                        },

                    }}
                />
            </div>
        </div>
    );
}
export default BoardModifyPage;