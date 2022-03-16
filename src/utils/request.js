import axios from "axios";
import Element from 'element-ui'
import {getToken} from "./auth";
import {logout} from "./login";
import * as Config from "../settings";

axios.defaults.baseURL = "http://localhost:8090"
let request = axios.create({
    baseURL: '/',
    timeout: Config.timeout // 请求超时时间
})

//添加响应拦截器
request.interceptors.response.use(response => {
        return response
    },
    error => {
        let code = error.response.data.status
        // Element.Message.error(code + ' ' + error.response.data.message)
        if (code === 401) {//如果认证失败，则实行注销操作
            Element.Message.error(code + ' ' + error.response.data.message)
            logout()
        }
        return Promise.reject(error)
    })

//请求拦截
request.interceptors.request.use(config => {
        if (getToken()) {
            config.headers['Authorization'] = getToken()
        }
        return config
    },
    error => {
        return Promise.reject(error)
    })

export default request
