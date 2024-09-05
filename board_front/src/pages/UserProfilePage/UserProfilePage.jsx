import { css } from '@emotion/react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { storage } from '../../firebase/firebase';
import { v4 as uuid } from 'uuid'
import "react-sweet-progress/lib/style.css";
import { Progress } from 'react-sweet-progress';
import { updateprofileImgApi } from '../../apis/userApi';
import { useNavigate } from 'react-router-dom';
/** @jsxImportSource @emotion/react */

const layout = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100px auto;
    width: 1000px;
`;


const imgBox = css`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 200px;
    height: 200px;
    box-shadow: 0px 0px 2px #00000088;
    cursor: pointer;
    overflow: hidden;

    & > img {
        height: 100%;
    }
`;

const progressBox = css`
    padding-top: 20px;
    width: 300px;
    padding-left: 40px;
`;

function UserProfilePage(props) {

    const queryClint = useQueryClient();
    const userInfoState = queryClint.getQueryState("userInfoQuery"); // 해당 회원 정보 가져오기 위해서 사용
    const [uploadPercent, setUploadPercent] = useState(0);
    const navigate = useNavigate();

    const handleImgChangeOnClick = () => {
        if (window.confirm("프로필 사진을 변경하시겠습니까?")) {
            const fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("accept", "image/*"); // 이미지 외에는 올 수 없게
            fileInput.click();

            fileInput.onchange = (e) => {
                const files = Array.from(e.target.files);
                const profileImage = files[0];
                setUploadPercent(0);

                const storageRef = ref(storage, `user/profile/${uuid()}_${profileImage.name}`);
                const uploadTask = uploadBytesResumable(storageRef, profileImage); //이 경로에, 이 파일 업로드 할거다
                uploadTask.on(
                    "state_changed", // 고정값
                    (snapshot) => { // 업로드 중
                        setUploadPercent(
                            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                    },
                    (error) => { // 오류
                        console.error(error);
                    },
                    async (success) => {// 업로드 완료
                        const url = await getDownloadURL(storageRef)
                        const response = await updateprofileImgApi(url);
                        queryClint.invalidateQueries(["userInfoQuery"]) // invalidateQueries = 강제로 query 만료시키기 - 만료되면 알아서 다시 들고온다
                    }
                );
            }
        }
    }

    const handleDefaultImgChangeOnChange = async () => {
        if (window.confirm("기본 이미지로 변경하시겠습니까?")) {
            await updateprofileImgApi("");
            queryClint.invalidateQueries(["userInfoQuery"]) // invalidateQueries = 강제로 query 만료시키기 - 만료되면 알아서 다시 들고온다
        }
    }

    const handleHomeOnClick = () => {
        if (window.confirm("홈으로 돌아가시겠습니까?")) {
            navigate("/")
        }
    }

     return (
        <div css={layout}>
            <h1>프로필</h1>
            <div css={imgBox} onClick={handleImgChangeOnClick}>
                <img src={userInfoState.data?.data.img} alt="" />
            </div>
            <div css={progressBox}>
                <Progress
                    percent={uploadPercent}
                    status={uploadPercent !== 100 ? "active" : "success"}
                />
            </div>
            <div>
                <button onClick={handleDefaultImgChangeOnChange}>기본 이미지로 변경</button>
                <button onClick={handleHomeOnClick}>홈으로</button>
            </div>
        </div>
    );
}

export default UserProfilePage;


// rules_version = '2';

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if
//           request.time < timestamp.date(2024, 10, 2);
//     }
//   }
// }