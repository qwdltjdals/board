import { instance } from "./util/instance";

export async function addWriteApi(board) {
    let response = null;
    try {
        response = await instance.post("/board", board);
    } catch(e) {
        console.error(e);
        response = e.response;
    }
    return response;
}