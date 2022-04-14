<template>
  <div>
    <div id="editor-container">
      <p>欢迎使用 <b>wangEditor</b> 富文本编辑器</p>
    </div>

    <div style="height: 200px; width: 600px;">
      <input type="file" id="testInput" accept="audio/*">
      请插入
      </input>
    </div>
  </div>
</template>

<script>
import wangEditor from 'wangeditor'
import { AlertMenu } from '@/wangEditor/customMenu'

export default {
  name: 'wangEditor',
  mounted () {
    const dom = document.getElementById('editor-container')
    // eslint-disable-next-line new-cap
    const editor = new wangEditor(dom)
    const menuKey = 'alertMenuKey'
    // 注册菜单
    editor.menus.extend(menuKey, AlertMenu)
    // 将菜单加入到 editor.config.menus 中    const menuKey = 'alertMenuKey'
    // editor.config.menus = editor.config.menus.concat(menuKey)
    editor.config.menus.push(menuKey)
    editor.create()
    window.editor = editor
    this.editor = editor

    const input1 = document.getElementById('testInput')
    console.log('插入之前的值', input1.outerHTML)
    input1.addEventListener('change', () => {
      console.log('插入以后的值', input1.outerHTML)
      input1.removeEventListener('change', () => console.log('a'))
    })
    console.log('绑定完成')
    input1.removeEventListener('change', () => console.log('a'))
  }
}
</script>

<style scoped>

</style>
