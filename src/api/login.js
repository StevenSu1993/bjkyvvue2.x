import request from '../utils/request'

export function login(username, password, code, uuid, rememberMe) {
    return request({
        url: 'api/auth/login',
        method: 'post',
        data: {
            username,
            password,
            code,
            rememberMe,
            uuid
        }
    })
}

export function getInfo() {
    return request({
        url: 'auth/info',
        method: 'get'
    })
}

export function getCodeImg() {
    return request({
        url: 'api/auth/getCode',
        method: 'get'
    }).then(res => res.data)
}

export function logout() {
    return request({
        url: 'http://localhost:8000/auth/logout',
        method: 'delete'
    })
}
