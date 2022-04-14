<template>
  <div style="height: auto">

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">
        <el-button type="text">首页</el-button>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-button type="text" disabled>模板素材</el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-row style="padding: 20px">
      <el-button type="primary" plain @click="newTemplate">新建模板</el-button>
      <el-button type="primary" plain>新建文件夹</el-button>
      <el-button type="primary" plain @click="testeditor">模板创建完成</el-button>
    </el-row>

    <!--    <VueUEditor @ready = 'editorReady' ></VueUEditor>-->
    <!--    <VueUEditor></VueUEditor> -->

    <!--    <vue-ueditor-wrap v-model="msg" :config="editorConfig" @ready="ready" v-for="item in 2" :key="item" @before-init="addCustomUI"></vue-ueditor-wrap>-->

    <!--    富文本编辑器-->
    <div class="editContent">
      <div id="editor-container" ref="editor">
        <p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p>
      </div>
      <div class="templatedetail">
        <el-form ref="form" :model="form">
          <el-form-item style="margin-bottom: 0">
            <span style="font-size: 14px"> 模板名称：</span>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.name" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="clearContent">清空模板</el-button>
          </el-form-item>
        </el-form>
        <!--          <div><span style="font-size: 14px"> 模板名称：</span></div>-->
        <!--          <div style="margin-top: 5px">-->
        <!--            <el-input placeholder="请输入模板名称" size="small"></el-input>-->
        <!--          </div>-->
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

export default {
  name: 'TemplateMaterial',
  components: {},
  data () {
    return {
      form: {
        name: ''
      }
    }
  },
  methods: {
    clearContent () {
      this.editor.txt.clear()
    },
    onSubmit () {
      console.log('submit!')
    },
    newTemplate () {
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
        const html = `<video src="${res.data.data.url}" controls="controls" style="max-width:100%"></video>`
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
          const html = `<img src="${res.data.data[0].url}" style="max-width:100%;" contenteditable="false">`
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
