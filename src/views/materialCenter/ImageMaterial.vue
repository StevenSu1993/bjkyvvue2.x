<template>
  <div height="100%" id="editorBox" ref="editor"></div>
</template>

<script>
import  E from 'wangeditor'
import {AlertMenu} from "../../wangEditor/adio"
export default {
  name: "ImageMaterial",
  mounted(){
    const menuKey = 'alertMenuKey'
    E.registerMenu(menuKey, AlertMenu)
    const dom = this.$refs.editor
    const editor = new E(dom)
    this.editor =editor
    //创建编辑器
    this.editor.create()

  }

}
</script>

<style scoped>

</style>
