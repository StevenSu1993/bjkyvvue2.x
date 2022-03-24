<template>
  <div>

    这是图文素材
  </div>

  <div height="100%" id=" editorBox"></div>
</template>

<script>
import E from 'wang-editor'
import { Video1, Voice1 } from '../../wangEditor/editorMenu.js'
export default {
  name: 'ImageMaterial',
  mounted () {
    const menuKeyVideo = 'video'
    const menuKeyVoice = 'voice'
    this.editor = new E('# editorBox')
    // 全局注册自定义菜单video, voice
    E.registerMenu(menuKeyVideo, Video1)
    E.registerMenu(menuKeyVoice, Voice1)

    // 创建编辑器
    this.editor.create()
  }

}
</script>

<style scoped>

</style>
