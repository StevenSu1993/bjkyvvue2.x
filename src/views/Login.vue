<template>

  <div class="login" :style="'background-image:url('+ Background +');'">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px"
             class="login-form">
      <h3 class="title">
        EL-ADMIN 后台管理系统
      </h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <!--          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />-->
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                  @keyup.enter.native="handleLogin">
          <!--          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />-->
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
                  @keyup.enter.native="handleLogin">
          <!--          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />-->
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode">
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">
        记住我
      </el-checkbox>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                   @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Background from '../assets/images/background.jpeg'
import { decrypt, encrypt } from '@/utils/rsaEncrypt'
import Cookies from 'js-cookie'
import Config from '../settings'
// import {setToken} from "../utils/auth";
import { getCodeImg } from '@/api/login'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  created () {
    this.getCode()
    this.getCookie()
  },
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
        rememberMe: false,
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      Background: Background,
      codeUrl: '',
      loading: false,
      // 把加密后的密码存放到Cookies
      cookiePass: ''
    }
  },
  methods: {
    getCookie () {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        code: ''
      }
    },
    getCode () {
      console.log('进入到getCode')
      // 发送请求给后端，需要用到axios
      getCodeImg().then(res => {
        this.codeUrl = res.data.img
        this.loginForm.uuid = res.data.uuid
      }).catch(err => {
        console.log(err.response)
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) { // 如果表单校验通过，则发送登陆请求
          const user = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            rememberMe: this.loginForm.rememberMe,
            code: this.loginForm.code,
            uuid: this.loginForm.uuid
          }
          if (user.password !== this.cookiePass) {
            user.password = encrypt(user.password)
          }
          if (user.rememberMe) {
            Cookies.set('username', user.username, { expires: Config.passCookieExpires })
            Cookies.set('password', user.password, { expires: Config.passCookieExpires })
            Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.loading = true

          /*    const login = this.$store.dispatch("login1", user);
              login.then(issuccesd => {
                if (issuccesd) {
                  this.$router.push('/index')
                }else {
                  this.loading = false
                    this.$message.error("请检查输入信息")
                }
              }) */

          // 另外一种写法 只有promise
          this.$store.dispatch('login', user).then(res => {
            console.log('登陆了,{}', res)
            this.$router.push('/index').catch(err => {
              console.log(err)
              this.$router.push('/index')
            })
          }).catch(err => {
            this.loading = false
            console.log(err.response)
            if (err.response.status === 401) {
              this.getCode()
              this.$message.error('用户名或密码错误')
            } else {
              // 验证码错误
              this.getCode()
              this.$message.error(err.response.data.msg)
            }
          })
        } else this.$message.error('请完善信息')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}

.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 385px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle
  }
}
</style>
