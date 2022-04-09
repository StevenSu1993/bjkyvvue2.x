<template>
  <div class="login-wrap">
        <h3 class="title">
          EL-ADMIN 后台管理系统
        </h3>
    <el-form label-position="left" v-model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px"
             class="demo-ruleForm login-container">
      <h3 class="title">用户登录</h3>
      <el-form-item prop="name">
        <el-input type="text" v-model="ruleForm.name" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="submitForm('ruleForm')" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>

export default {
  name: 'Login111111',

  data () {
    return {
      // Background: Background,
      // 定义loading默认为false
      logining: false,
      // 记住密码
      rememberpwd: false,
      ruleForm: {
        // username和password默认为空
        name: 'zhangsan',
        password: 'zhangsan',
        code: ''
      },
      // rules前端验证
      rules: {
        name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },

  methods: {
    // 获取info列表
    submitForm (formName) {
      // 输入校验
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.logining = true
          // 去后台获取jwt
          /*  await this.axios.get("api/hello").then(res => {
              console.log("houduan")
            }) */
          await this.axios.post('api/login', this.ruleForm)
            .then(res => {
              console.log('res=>', res.data)
              this.logining = false
              // JSON.stringify(res.data)
              this.$store.commit('login', res.data.data)
              // 登录成功后跳转到首页
              this.$router.push({ path: '/index' })
            })

          // 测试通道，不为空直接登录
          // setTimeout(() => {
          //   this.logining = false
          //   this.$store.commit('api/login', 'true')
          //   //登录成功后跳转到首页
          //   this.$router.push({path: '/index'})
          // }, 1000)

          // TODO记住密码操作
        } else {
          this.$message.error('请输入用户名密码！')
          this.logining = false
          return false
        }
      })
    }

  }
}
</script>
<style scoped>
.login-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 10%;

  background-color: #112346;
  background-repeat: no-repeat;
  background-position: center right;
  background-size: 100%;
}

.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.remember {
  margin: 0px 0px 35px 0px;
}

</style>
