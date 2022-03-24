<template>
  <div>

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
    <div id="div1" ref="editor">
      <p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p>
    </div>
    <input type="button" value="显示编辑器内容（从控制台查看）"  @click="testeditor">
    <!--    <VueUeditorWrap></VueUeditorWrap>-->
  </div>

</template>

<script>

import wangEditor from 'wangeditor'

export default {
  name: 'TemplateMaterial',
  components: {

  },
  methods: {
    newTemplate () {
    // 创建新模板
    },
    testeditor () {
      console.log(this.editor)
      console.log(this.editor.txt.html())
      alert('创建完成')
    }
  },
  mounted () {
    // const dom = document.getElementById('div1')
    // 两种写法都可以
    const dom = this.$refs.editor
    // eslint-disable-next-line new-cap
    const editor = new wangEditor(dom)
    editor.config.uploadImgShowBase64 = true
    editor.config.uploadVideoAccept = ['mp4', 'mp3']
    // editor.config.uploadFileName = 'your-custom-fileName'
    // 配置 server 接口地址
    editor.config.uploadVideoServer = '/api/upload-video'
    editor.create()
    console.log(editor)
    // 也能够动态的去往data 中添加数据跟小程序一样
    this.editor = editor
  },
  data () {
    return {
    }
  }

}
</script>

<style scoped>

</style>
