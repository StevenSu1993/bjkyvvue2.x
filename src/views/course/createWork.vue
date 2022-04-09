<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/work' }">
        <el-button type="text">作业课程</el-button>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-button type="text" disabled>创建作业课程</el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-form v-model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="作业标题/班级名" prop="name">
        <el-input placeholder="请输入不超过30汉字或60字母的标题" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="定时提醒" prop="remind">
        <el-switch v-model="ruleForm.remind"></el-switch>
      </el-form-item>
      <div v-show="ruleForm.remind">
        <el-form-item label="每日定时提醒作业" required>
          <el-col :span="3">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
          <template>
            <el-radio v-model="ruleForm.promptlyRemind" label="1" style="margin-left: 20px">发送作业开始提醒</el-radio>
            <el-button type="text" disabled size="mini">作业开始时间向有权限的学员发送提醒</el-button>
          </template>
        </el-form-item>
      </div>

      <el-form-item size="mini" label="可补打卡次数" prop="name">
        <template>
          <el-input-number v-model="ruleForm.supplementNum" :min="0" :max="10"></el-input-number>
          <el-button style="margin-left: 20px" type="text" disabled size="mini">0表示不允许补充打卡</el-button>
        </template>
      </el-form-item>

      <el-form-item label="参与对象设置" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="任何人可参加" name="type"></el-checkbox>
          <el-checkbox name="type">
            <template>
              <el-select size="mini" v-model="ruleForm.classes" placeholder="指定班级">
                <el-option
                    v-for="item in ruleForm.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label=" 作业提示(可选):" prop="type111">
        <el-input placeholder="请输入打卡提示" v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item label=" 作业范本(可选):" prop="type111">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'createWork',

  data () {
    return {
      ruleForm: {
        classes: [],
        remind: false,
        promptlyRemind: true,
        supplementNum: 0,
        name: '',
        options: [],
        date2: '',
        type: [],
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在不吵过30个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
          this.$request.post('api/auth/createCourse', this.ruleForm).then(res => {
            console.log('this is create course返回值 : {}', res.data)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }

}
</script>

<style scoped>

</style>
