import { instance } from "./util/instance"

export const singupApi = async (user) => { // 회원가입 할 수 있는 유저 정보가 매개변수로 들어옴 이걸로 요청을 날림
    let signupData = {
        isSuccess: false,
        ok: {
            message: "",
            user: null
        },
        fieldErrors: [
            {
                field: "",
                defaultMessage: "" // 백엔드에꺼
            }
        ],
    }
    try {
        const response = await instance.post("/auth/signup", user);
        signupData = {
            isSuccess: true,
            ok: response.data
        }
    }catch (error) {
        const response = error.response;
        signupData = {
            isSuccess: false,
            fieldErrors: response.data.map(fieldError => ({
                field : fieldError.field,
                defaultMessage: fieldError.defaultMessage
            })),
        }
    }
    return signupData;
}