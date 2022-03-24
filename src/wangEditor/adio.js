import E from 'wangeditor'
const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E
const icon = require('@/assets/images/yinpin.png')
const funcs = (e) => {
  return new Promise((resolve, reject) => {
    const ajax = new XMLHttpRequest()
    ajax.open('POST', 上传音频地址, true)
    ajax.send(e)
    ajax.onreadystatechange = function (e) {
      if (ajax.readyState === 4) {
        try {
          const res = JSON.parse(ajax.responseText).data

          if (JSON.parse(ajax.responseText).code === 200) {
            resolve(res)
          } else {
            message.error('上传错误！')
          }
        } catch (e) {
          message.error('上传错误！')
        }
      }
    }
  })
}
const UploadImg = (file) => { // 这里resolve传给后台的data数据
  return new Promise((resolve, reject) => {
    const data = new FormData()
    data.append('file', file)
    reader.readAsDataURL(file)
    const audio = document.createElement('audio')
    reader.onload = (e) => {
      audio.src = e.target.result
      audio.oncanplay = (e) => {
        resolve(data)
      }
    }
  })
}
// 官网提供代码
class AlertMenu extends BtnMenu {
  constructor (editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = E.$(
            `<div class="w-e-menu" data-title="音乐">
                <img src="${icon}"/>
                <input type="file" id="audio"   accept="audio/*" style="position:absolute;left:0;width:40px;opacity:0;" "/>
            </div>`// 这里的input用于吊起上传音频
    )
    super($elem, editor)
  }

  // 菜单点击事件
  clickHandler () {
    const editor = this.editor
    const input = document.getElementById('audio')
    input.removeEventListener('change', () => console.log('a'))// 这里和下面的removeEventListener要加上，不然会触发多次change事件。
    input.addEventListener('change', function (e) {
      const files = this.files
      UploadImg(this.files[0]).then((res) => {
        message.loading({ content: '正在上传', duration: 0, key: 'load' })
        editor.disable()// 正在上传音频的时候，禁止编辑器的使用
        funcs(res).then((e) => {
          editor.enable()// 上传完毕，允许编辑器使用，这一行必须在插入html上面，否则，插入html失效，毕竟，编辑器被禁用了。
          const html = `<audio src="${e.baseUrl}" fileid="${e.id}" controls></audio></br>`
          editor.cmd.do('insertHTML', html)
          message.success('上传成功')
          message.destroy('load')
        })
      })
      // }
    })

    input.removeEventListener('change', () => console.log('a'))
    input.outerHTML = input.outerHTML
    return false
  }

  tryChangeActive (e) {}
}
export { AlertMenu }
