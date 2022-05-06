import wangEditor from 'wangeditor'
import Config from '@/settings'
import { getToken } from '@/utils/auth'
import { AlertMenu } from '@/wangEditor/customMenu'
import request from '@/utils/request'

const upLoadVideoUrl = '/api/auth/wangEditorupVideo'
const upLoadImgUrl = '/api/auth/wangEditorupImage'

function UploadAudio (file, upLoadUrl) {
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

export const BASE_URL = 'localhost:8090'

export function getWangEdit () {
  var dom = document.getElementById('editor-container')
  var menuKey = 'alertMenuKey'
  // eslint-disable-next-line new-cap
  var editor = new wangEditor(dom)
  editor.config.height = Config.wangEditorHeight1

  editor.config.uploadVideoAccept = ['mp4', 'mp3']

  editor.config.uploadVideoHeaders = {
    Authorization: getToken()
  }
  editor.config.uploadImgHeaders = {
    Authorization: getToken()
  }
  editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
    // resultFiles 是 input 中选中的文件列表
    // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
    UploadAudio(resultFiles[0], upLoadVideoUrl).then(res => {
      // 上传视频，返回结果，将视频地址插入到编辑器中
      const html = `<br><video src="${res.data.data.url}" controls="controls" style="max-width:100%"></video></br>`
      editor.cmd.do('insertHTML', html)
    })
  }
  // const html = `<audio src="${Config.baseUrl}/${res.data}"  fileid="${e.id}" controls></audio></br>`
  // editor.cmd.do('insertHTML', html)
  editor.config.customUploadImg = function (resultFiles, insertImgFn) {
    // resultFiles 是 input 中选中的文件列表
    // insertImgFn 是获取图片 url 后，插入到编辑器的方法
    // 上传图片，返回结果，将图片插入到编辑器中
    for (let i = 0; i < resultFiles.length; i++) {
      UploadAudio(resultFiles[i], upLoadImgUrl).then(res => {
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
  return editor
}
