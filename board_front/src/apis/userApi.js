import { instance } from "./util/instance";

export const updateprofileImgApi = async(img) => {
    let response = null;
    try {
        response = await instance.patch("/user/img", {img})
    } catch(error) {
        console.error(error);
        response = error.response;
    }
    return response;
}