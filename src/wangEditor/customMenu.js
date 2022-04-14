import E from 'wangeditor'
// import { Message } from 'element-ui'
import request from '@/utils/request'
import { Message } from 'element-ui'
import Config from '../settings'

const icon = require('@/assets/images/yinpin.png')
const upAdioUrl = 'http://localhost:8090/auth/uploadFile'

const { BtnMenu } = E

const UploadAudio = (file) => {
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
    request.post(upAdioUrl, data, config).then(response => {
      resolve(response.data)
      console.log(response.data)
    })
  })
}

// 第一，菜单 class ，Button 菜单继承 BtnMenu class
class AlertMenu extends BtnMenu {
  constructor (editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = E.$(
      `<div class="w-e-menu" data-title="音乐">
                <img src="${icon}"/>
                <input type="file" id="audio"  accept="audio/*" style="position:absolute;left:0;width:40px;opacity:0;" "/>
            </div>`// 这里的input用于吊起上传音频
    )
    super($elem, editor)
  }

  // 菜单点击事件
  clickHandler () {
    // 因为创建的时候把editor 绑定到了window对象上去了
    const editor = this.editor
    const input = document.getElementById('audio')
    input.addEventListener('change', function (e) {
      console.log(this.files)
      // const files = this.files
      editor.disable()
      UploadAudio(this.files[0]).then(res => {
        // 上传成功以后把数据回显到editor中去
        console.log('res', res, 'e', e)
        // var src = Config.baseUrl + res.data.data
        editor.enable()// 上传完毕，允许编辑器使用，这一行必须在插入html上面，否则，插入html失效，毕竟，编辑器被禁用了。
        const html = `<audio src="${Config.baseUrl}/${res.data}"  fileid="${e.id}" controls></audio></br>`
        editor.cmd.do('insertHTML', html)
        Message.success('插入成功')
      })
    })
    // 清空input 中的file,不然又缓存。
    // input.value = ''
    // eslint-disable-next-line no-self-assign
    input.outerHTML = input.outerHTML
  }

  tryChangeActive () {
  }
}

export { AlertMenu }
