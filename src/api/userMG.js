import { loginreq} from './axiosFun';

// 登录接口 
export const login = (params) => { return loginreq("post", "/api/login", params) };
