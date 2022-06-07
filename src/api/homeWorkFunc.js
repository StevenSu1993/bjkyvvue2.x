import request from '../utils/request'
import { Message } from 'element-ui'
import dateFormat from '@/utils/dateFormat'

const homeListByCourseURL = '/api/auth/getAllHomeWorkByCourseId'
const createHomeWorkURL = '/api/auth/createHomeWork'
const CommentListPage = '/api/auth/getCommentListPage'
const CommentListByCommentId = '/api/auth/getCommentListByCommentId'
const SubmitComment = '/api/auth/creatComment'

export function getHomeListByCourseId () {
  return request.get(homeListByCourseURL).then(res => {
    // console.log('getAllHomeList', res)
    return res.data.data
  })
}

export async function createHomeWork (params) {
  await request.post(createHomeWorkURL, params).then(res => {
    Message.success('新建作业成功')
  })
}

export function getCommentListPage (params) {
  return request.get(CommentListPage, { params }).then(res => {
    return res.data.data.records
  })
}

export function formatDate (time) {
  return dateFormat('YYYY-mm-dd HH:MM', new Date(time))
}

export function byteToUrl (bytes) {
  var blob = new Blob([bytes], { type: 'audio/mpeg' })
  // var blob = new Blob([bytes])
  console.log('blob', blob)
  // var blob = new Blob([filereader.result])
  // return window.URL.createObjectURL(blob)
  return window.URL.createObjectURL(blob)
}

export function downLoadMp3 (url) {
  const arr = url.split('/')
  const fileName = arr[arr.length - 1]
  console.log(arr)
  // 也可以不用fecth 使用axois一样的
  fetch(url).then(res => {
    res.blob().then(blob => {
      var a = document.createElement('a')
      var url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    })
  })
}

export function getCommentByCommentId (params) {
  return request.get(CommentListByCommentId, { params }).then(res => {
    return res.data.data
  })
}

export function submitComment (params) {
  return request.post(SubmitComment, params).then(res => {
    return res.data.data
  })
}
