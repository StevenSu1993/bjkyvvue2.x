import {removeToken} from "./auth";
import Config from "../settings";
import router from "../router";
import request from "../utils/request";

export function logout(){
    request.delete('api/auth/logout').then(res => {
        removeToken(Config.TokenKey)
        router.replace('/').then(res => {})
    })
}
