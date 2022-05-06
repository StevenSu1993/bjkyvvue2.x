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
          :visible.sync="showDialog"
          :before-close="handleDialogClose"
          width='710px'
          heigth="400px"
          top="15vh">

        <div class="dialogContent">
          <el-button @click="showImg">图片</el-button>
          <el-button @click="showVideo">视频</el-button>
          <el-button @click="showAudio">音频</el-button>
          <!--          <Detail></Detail>-->
          <div class="head" v-if="isShowImg || isShowAudio || isShowVideo">
            <el-button-group style="margin-left: 30px">
              <el-button type="primary" size="mini" plain @click="changRangBySelf">仅自己</el-button>
              <el-button type="primary" size="mini" plain @click="changRangByAll">全部</el-button>
            </el-button-group>
            <el-select ref="elSelect" placeholder="请选择" v-model="orderValue" size="mini"
                       style="width: 100px;margin-left: 20px">
              <el-option value="0" label="按名称"></el-option>
              <el-option value="1" label="按时间"></el-option>
            </el-select>
            <el-input v-model="materialName" placeholder="请输入图片名称搜索"
                      size="mini"
                      style="width:160px;;margin-left: 20px"></el-input>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchByLike">搜索</el-button>
          </div>
          <div class="details" v-if="isShowImg">
            <ImgDetail ref="Detail" :addChildId="addChildId"
                       :removeChildId="removeChildId"
                       v-for="item in fileData" :key="item.id"
                       :fileId="item.id"
                       :src='"api/" + item.uuidFileName'
                       :url="item.url"
                       :fileName="item.fileName"
            ></ImgDetail>

            <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
            <el-button class="confirm" type="primary" icon="el-icon-check" @click="insertToHTML">插入正文</el-button>
          </div>
          <div class="details" v-if="isShowVideo">
            <VideoDetail ref="Detail" :addChildId="addChildId"
                         :removeChildId="removeChildId"
                         v-for="item in fileData" :key="item.id"
                         :fileId="item.id"
                         :src='"api/" + item.uuidFileName'
                         :url="item.url"
                         :fileName="item.fileName"
            ></VideoDetail>

            <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
            <el-button class="confirm" type="primary" icon="el-icon-check" @click="insertToHTML">插入正文</el-button>
          </div>
          <div class="details" v-if="isShowAudio">
            <AudioDetail ref="Detail" :addChildId="addChildId"
                         :removeChildId="removeChildId"
                         v-for="item in fileData" :key="item.id"
                         :fileId="item.id"
                         :src='"api/" + item.uuidFileName'
                         :url="item.url"
                         :fileName="item.fileName"
            ></AudioDetail>

            <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
            <el-button class="confirm" type="primary" icon="el-icon-check" @click="insertToHTML">插入正文</el-button>
          </div>
        </div>
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
    <input type="button" value="显示编辑器内容（从控制台查看）" style="margin-left: 20px" @click="testeditor">
  </div>

</template>

<script>

import wangEditor from 'wangeditor'
import { AlertMenu } from '@/wangEditor/customMenu'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import ImgDetail from '@/views/materialCenter/items/ImgDetail'
import VideoDetail from '@/views/materialCenter/items/VideoDetail'
import AudioDetail from '@/views/materialCenter/items/AudioDetail'
import Pagination from '@/components/Pagination'
import Config from '@/settings'

export default {
  name: 'NewTemplateMaterial',
  components: {
    ImgDetail,
    Pagination,
    VideoDetail,
    AudioDetail
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
      showDialog: false,
      isShowImg: false,
      isShowAudio: false,
      isShowVideo: false,
      materialName: '',
      pageparm: {
        currentPage: 0,
        pageSize: 10,
        total: 0
      },
      rang: '',
      type: 1,
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
    changRangBySelf () {
    },
    changRangByAll () {
    },
    searchByLike () {
      console.log(this.deFaultQueryData)
      const params = { ...this.deFaultQueryData }
      if (this.materialName.length > 0) {
        params.name = this.materialName
      }
      console.log(params)
      this.initData(params)
    },
    insertToHTML () {
      let html = ''
      if (this.isShowImg) {
        this.filesUrlList.forEach((item) => {
          html = `<br><img src="${item}" style="max-width:100%;" contenteditable="false"></br>`
          this.editor.cmd.do('insertHTML', html)
        })
      } else if (this.isShowVideo) {
        this.filesUrlList.forEach((item) => {
          html = `<br><video src="${item}" controls="controls" style="max-width:100%"></video></br>`
          this.editor.cmd.do('insertHTML', html)
        })
      } else {
        this.filesUrlList.forEach((item) => {
          html = `<br><audio src="${item}"  controls></audio><br/>`
          this.editor.cmd.do('insertHTML', html)
        })
      }
      this.showDialog = false
      // 取消掉所有选中的
      this.$refs.Detail.forEach(item => {
        item.$emit('canceCheck')
      })
      this.filesUrlList = []
      this.filesIdList = []
      // this.editor.cmd.do('insertHTML', html)
    },
    addChildId (childFilesId, childUrl) {
      console.log(childUrl)
      this.filesIdList.push(childFilesId)
      this.filesUrlList.push(childUrl)
    },
    removeChildId (childFilesId, childUrl) {
      const i = this.filesIdList.indexOf(childFilesId)
      this.filesIdList.splice(i, 1)
      const j = this.filesUrlList.indexOf(childUrl)
      this.filesUrlList.splice(j, 1)
    },
    showImg () {
      this.isShowVideo = false
      this.isShowAudio = false
      this.isShowImg = true
      this.type = 1
      console.log(this.deFaultQueryData)
      // // 发送请求去获取后台数据
      // const params = { ...this.deFaultQueryData }
      // params.type = 1
      // // 页面以初始化的情况下就按照时间进行排序
      this.initData(this.deFaultQueryData)
    },
    initData (params) {
      this.$request('api/auth/getAllFileByType', {
        params
      }).then(res => {
        this.fileData = res.data.data.records
        this.fileTotal = res.data.data.total
        this.pageparm.total = res.data.data.total
      })
    },
    showVideo () {
      this.isShowAudio = false
      this.isShowImg = false
      this.isShowVideo = true
      this.type = 3
      this.initData(this.deFaultQueryData)
    },
    showAudio () {
      this.isShowVideo = false
      this.isShowImg = false
      this.isShowAudio = true
      this.type = 5
      this.initData(this.deFaultQueryData)
    },
    useTemplateMaterial () {
      this.showDialog = true
    },
    handleDialogClose () {
      this.showDialog = false
      this.isShowVideo = false
      this.isShowImg = false
      this.isShowAudio = false
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
    },
    testeditor () {
      console.log(this.editor)
      console.log(this.editor.txt.html())
      alert('创建完成')
    },
    UploadAudio (file, upLoadUrl) {
      // 这里resolve传给后台的data数据
      return new Promise((resolve, reject) => {
        const data = new FormData()
        data.append('file', file)
        // FormData私有类对象，访问不到，通过get判断值是否传进去
        console.log(data.get('file'))
        // 设置请求头
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
        request.post(upLoadUrl, data, config).then(response => {
          resolve(response)
          console.log(response.data)
        })
      })
    }
  },
  mounted: function () {
    const that = this
    // const dom = document.getElementById('div1')
    // 两种写法都可以
    const menuKey = 'alertMenuKey'
    const dom = this.$refs.editor
    // eslint-disable-next-line new-cap
    const editor = new wangEditor(dom)
    editor.config.height = Config.wangEditorHeight
    // editor.config.uploadImgShowBase64 = true
    editor.config.uploadVideoAccept = ['mp4', 'mp3']
    // editor.config.uploadFileName = 'your-custom-fileName'
    // 配置 server 接口地址
    const upLoadVideoUrl = '/api/auth/wangEditorupVideo'
    const upLoadImgUrl = '/api/auth/wangEditorupImage'
    editor.config.uploadVideoHeaders = {
      Authorization: getToken()
    }
    editor.config.uploadImgHeaders = {
      Authorization: getToken()
    }
    editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
      that.UploadAudio(resultFiles[0], upLoadVideoUrl).then(res => {
        console.log('插入视频', res)
        // 上传视频，返回结果，将视频地址插入到编辑器中
        const html = `<br><video src="${res.data.data.url}" controls="controls" style="max-width:100%"></video></br>`
        editor.cmd.do('insertHTML', html)
        // 不适用他提供的方法，因为在vue 中有跨域问题。
        // insertVideoFn('/api/' + res.data.data.url)
      })
    }
    // const html = `<audio src="${Config.baseUrl}/${res.data}"  fileid="${e.id}" controls></audio></br>`
    // editor.cmd.do('insertHTML', html)
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      // 上传图片，返回结果，将图片插入到编辑器中
      for (let i = 0; i < resultFiles.length; i++) {
        that.UploadAudio(resultFiles[i], upLoadImgUrl).then(res => {
          console.log('插入图片', res)
          // 上传视频，返回结果，将视频地址插入到编辑器中
          // 上传图片，返回结果，将图片插入到编辑器中
          const html = `<br><img src="${res.data.data[0].url}" style="max-width:100%;" contenteditable="false"></br>`
          editor.cmd.do('insertHTML', html)
          // insertImgFn('/api/' + res.data.data[0].url)
        })
      }
    }
    // 注册菜单
    editor.menus.extend(menuKey, AlertMenu)
    // 将菜单加入到 editor.config.menus 中    const menuKey = 'alertMenuKey'
    // editor.config.menus = editor.config.menus.concat(menuKey)
    editor.config.menus.push(menuKey)
    editor.create()
    console.log(editor)
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

.dialogContent {
  height: 500px;
}

/*::v-deep .el-dialog__body {
  height: 500px !important;
}*/
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

</style>
