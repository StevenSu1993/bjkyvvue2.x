<template>
  <div style="height: auto">
    <el-dialog
        class="dialog"
        :visible.sync="isShowDialog"
        :before-close="handleDialogClose"
        width='710px'
        heigth="400px"
        top="15vh">
      <MaterialListDialog @closeDialogByFather="closeDialogByFather"></MaterialListDialog>

    </el-dialog>

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

    <!--    富文本编辑器-->
    <div class="editContent">
      <div id="editor-container" ref="editor">

      </div>
      <div class="templatedetail">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item style="margin-bottom: 0" label="模板名称：" prop="name">
            <!--            <span style="font-size: 14px"> 模板名称：</span>-->
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-input v-model="form.name" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>

</template>

<script>

import { getWangEdit } from '@/api/comment'
import MaterialListDialog from '@/components/MaterialListDialog'

export default {
  name: 'CreateHomeWork',
  components: {
    MaterialListDialog
  },
  data () {
    return {
      queryUrl: '/api/auth/updateTemplate',
      isShowDialog: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入模板名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ]
      },
      rang: '',
      type: 1
    }
  },
  methods: {
    back () {
      this.$router.push({
        name: 'editCourse',
        params: {
          id: this.$route.params.params.id,
          row: this.$route.params.params.row
        }
      })
    },
    closeDialogByFather (value) {
      this.isShowDialog = value
    },
    handleDialogClose (done) {
      done()
    },
    useTemplateMaterial () {
      this.isShowDialog = true
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

  },
  mounted: function () {
    var editor = getWangEdit()
    // 也能够动态的去往data 中添加数据跟小程序一样
    window.editor = editor
    this.editor = editor

    // 回填数据
    console.log('开始回显数据', this.$route.params)
  }
}
</script>

<style scoped>
/*region  修改富文本编辑器的默认样式 */
#editor-container {
  margin-left: 20px;
  display: inline-block;
  /*border: green solid 1px;*/
  /*height: 500px;*/
  width: 80%;
}

::v-deep .w-e-toolbar {
  z-index: 2 !important;
}

::v-deep .w-e-menu {
  z-index: 1 !important;
}

::v-deep .w-e-text-container {
  z-index: 1 !important;
}

/*::v-deep .w-e-text-container {
  height: 450px!important;
}*/
/*endregion*/
.editContent {

  display: flex;
  flex-wrap: nowrap;
}

.templatedetail {
  margin-left: 20px;
}

.dialogContent {
  height: 500px;
}

.confirm {
  position: absolute;
  bottom: 0.1rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: inline-block;
  /*background: lawngreen;*/

  height: 40px;
  width: 120px;
}

.pagination {
  position: absolute;
  bottom: 3rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: inline-block;
  text-align: center;
}

.head {
  margin-top: 15px;
  margin-bottom: 15px;
  float: right;
}

.details {
  clear: both;
  display: flex;
  flex-flow: wrap;
  /*justify-content: space-between;*/
}

.headDiv {
  background-color: #ffffff;
  box-shadow: #000000 0px 0px 1px 0px;
  color: #354369;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  line-height: 55px;
  padding: 0px 20px;

}

.back {
  color: #354369;
  display: inline;
  font-size: 14px;
  line-height: 55px;
  cursor: pointer;
}

.icon-fanhui {
  cursor: pointer;
  font-size: 14px;
  color: #3d7dfd;
  display: inline;
  line-height: 55px;
  margin: 0px 10px 0px 0px;

}

.icon-RectangleCopy, .icon-qingkong, .icon-sucaiku-1 {
  cursor: pointer;
  font-size: 16px;
  display: inline;
  line-height: 55px;
  margin: 0px 10px 0px 0px;
}
</style>
