<template>
  <div style="height: auto">

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">
        <el-button type="text">首页</el-button>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-button type="text" disabled>新建模板素材</el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-row style="padding: 20px">
      <el-button type="primary" plain @click="showAllTemplate">主题模板</el-button>
      <el-button type="primary" plain @click="useTemplateMaterial">使用已有素材</el-button>
      <el-dialog
          class="dialog"
          :visible.sync="isShowDialog"
          :before-close="handleDialogClose"
          width='710px'
          heigth="400px"
          top="15vh">

        <MaterialListDialog @closeDialogByFather="closeDialogByFather"/>
      </el-dialog>
    </el-row>
    <!--    富文本编辑器-->
    <div class="editContent">
      <div id="editor-container" ref="editor">

      </div>
      <div class="templatedetail">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item style="margin-bottom: 0" label="模板名称:" prop="name">
            <!--            <span style="font-size: 14px"> 模板名称：</span>-->
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-input v-model="form.name" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
            <el-button @click="clearContent">清空模板</el-button>
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
  name: 'NewTemplateMaterial',
  components: {
    MaterialListDialog
  },
  computed: {
    deFaultQueryData: {
      get () {
        return {
          start: this.pageparm.currentPage,
          size: this.pageparm.pageSize,
          type: this.type, // 0 所有文件 1 表示图片,2 表示文档,3 表示视频,4 表示种子,5 表示音乐,6 表示其它
          rang: this.rang,
          orderValue: this.orderValue
        }
      },
      set (oldValue, newValue) {
        console.log(newValue)
      }
    },
    templateData: {
      get () {
        return {
          name: this.form.name,
          content: this.editor.txt.html(),
          curentFolderId: this.curentFolderId,
          isFolder: false
        }
      }
    }
  },
  data () {
    return {
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
      type: 1,
      isShowDialog: false,
      orderValue: '',
      fileData: [],
      fileTotal: '',
      filesIdList: [],
      filesUrlList: [],
      curentFolderId: ''
    }
  },
  methods: {
    callFather (pageparm) {
      console.log('pageparm的值为', pageparm)
      const params = { ...this.deFaultQueryData }
      params.start = pageparm.currentPage
      params.pageSize = pageparm.pageSize
      if (this.materialName.length > 0) {
        params.name = this.materialName
      }
      // TODO去后端获取数据
      this.initData(params)
    },
    closeDialogByFather (value) {
      this.isShowDialog = value
    },
    initData (params) {
      this.$request('api/auth/getAllFileByType', {
        params
      }).then(res => {
        this.fileData = res.data.data.records
        this.fileTotal = res.data.data.total
        // this.pageparm.total = res.data.data.total
      })
    },
    useTemplateMaterial () {
      this.showDialog = true
    },
    handleDialogClose (done) {
      done()
    },
    clearContent () {
      this.editor.txt.clear()
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交数据给后台
          console.log(this.templateData)
          var params = this.templateData
          params.parentFolderId = this.curentFolderId
          this.$request.post('/api/auth/createTemplate', params).then(res => {
            console.log(res)
            this.$message.success('创建模板成功')
          })
        } else {
          this.$message.error('请输入模板名称')
          return false
        }
      })
      console.log('submit!')
    },
    showAllTemplate () {
      // 创建新模板
    }
  },
  mounted: function () {
    var editor = getWangEdit()
    // 也能够动态的去往data 中添加数据跟小程序一样
    window.editor = editor
    this.editor = editor

    this.curentFolderId = this.$route.params.curentFolderId
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
</style>
