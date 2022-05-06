<template>
  <div class="headDiv">
    <div class="backhead" style="margin-left: 20px;" @click="back">
      <i class="iconfont icon-fanhui"></i>
      <span class="back">返回</span>
    </div>
    <div class="func">
        <span class="func" style="margin-left: 20px;" @click="useTemplateMaterial">
          <i class="iconfont icon-RectangleCopy"></i>
          <span class="back">使用已有素材</span>
        </span>
      <span class="func" style="margin-left: 20px;" @click="useTemplateMaterial">
          <i class="iconfont icon-sucaiku-1"></i>
          <span class="back">主题模板</span>
        </span>
      <span class="func" style="margin-left: 20px;" @click="clearContent">
          <i class="iconfont icon-qingkong"></i>
          <span class="back">清空主题</span>
        </span>
      <span class="func" style="margin-left: 20px;" @click="onSubmit('form')">
          <el-button type="primary" plain>保存模板</el-button>
        </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplateHead',
  data () {
    return {
      showDialog: false,
      queryUrl: ''
    }
  },
  methods: {
    back () {
      this.$router.push({
        path: '/TemplateM'
      })
    },
    useTemplateMaterial () {
      this.showDialog = true
    },
    clearContent () {
      this.editor.txt.clear()
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交数据给后台
          console.log(this.templateData)
          this.$request.post(this.queryUrl, this.templateData).then(res => {
            console.log(res)
            this.$message.success('更新模板成功')
          })
        } else {
          this.$message.error('请输入模板名称')
          return false
        }
      })
      console.log('submit!')
    }
  }
}
</script>

<style scoped>

</style>
