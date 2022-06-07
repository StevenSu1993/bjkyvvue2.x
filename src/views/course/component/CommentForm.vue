<template>
  <div>
    <el-form ref="form" :model="form">
      <el-form-item style="margin-bottom: 0" label="评分：" label-width="100px" prop="name">
        <!--                  <Stars></Stars>-->
        <el-rate
            text-color="#ff9900"
            v-model="form.startValue"
            show-score>
        </el-rate>
      </el-form-item>

      <el-form-item style="margin-bottom: 0" label="点评：" label-width="100px" prop="name">
        <el-input type="textarea" :rows="5" v-model="form.desc"></el-input>
      </el-form-item>

      <el-form-item style="margin-bottom: 0" label-width="100px">
        <!--        内容展示页面-->
        <div>
          <!--          录音展示-->
          <div>
            <my-audio style="display: inline-block; margin-right: 40px;" v-for="(item, index) in recoderUrlList"
                      :key="index" :fileurl="item"/>
          </div>
          <!--          音频内容展示-->
          <div class="audioCss" v-for="(item, index) in audioUrlList" :key="index">
            <my-audio style="width:200px;margin-top: 10px;" :fileurl="item"/>
            <span class="removeAudio iconfont icon-shanchu" @click="removeAudio(item)"></span>
          </div>
          <!--          图片内容展示-->
          <div style="display: flex">
            <div class="imgCss" v-for="(item, index) in imgUrlList" :key="index">
              <img style="width: 80%;height: 100%" :src="item"/>
              <span class="removeImg iconfont icon-shanchu" @click="removeImg(item)"></span>
            </div>
          </div>
          <!--          视频内容展示-->
          <div style="display: flex">
            <div class="imgCss" v-for="(item, index) in vedioUrlList" :key="index">
              <my-vedio :fileurl="item"></my-vedio>
              <span class="removeVedio iconfont icon-shanchu" @click="removeVedio(item)"></span>
            </div>
          </div>
        </div>

      </el-form-item>

      <el-form-item style="margin-top: 20px" label-width="100px" prop="name">
        <span class="box iconfont icon-huatong" @click="showRecord">录音</span>
        <span class="box iconfont icon-tupian" @click="showImgList">图片</span>
        <span class="box iconfont icon-yinle1" @click="showAudioList">音频</span>
        <span class="box iconfont icon-shipin" @click="showVedioList">视频</span>

        <!-- :append-to-body="true"嵌套弹框）被蒙版遮住-->
        <el-dialog
            class="dialog"
            :visible.sync="isShowDialog"
            :before-close="handleDialogClose"
            :append-to-body="true"
            width='710px'
            heigth="400px"
            top="15vh">

          <div v-if="isShowRecorder">
            <div class="recorderContent">
              <div style="font-size:14px;color:#354369">
                <div>录音</div>
                <div>{{ transferTime(recorder.duration) }} / 05:00</div>
              </div>

              <div>
                <el-button type="success" v-if="isStartRecorder" @click="handleStart">开始</el-button>
                <el-button type="warning" v-if="isStopRecorder" @click="handleStop">停止录音</el-button>
              </div>

              <div>
                <Button type="info" @click="getMp3Data()" style="margin:1vw;">下载MP3</Button>
                <el-button type="success" icon="el-icon-check" circle @click="useRecorder"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle @click="cancelRecorder"></el-button>
              </div>
            </div>

          </div>
          <ImgListDialog v-if="isShowImgList" :add="imgAdd" :urlAdd="imgUrlAdd"></ImgListDialog>
          <AudioListDialog v-if="isShowAudioList" :add="audioAdd" :urlAdd="audioUrlAdd"></AudioListDialog>
          <VideoListDialog v-if="isShowVideoList" :add="videoAdd" :urlAdd="videoUrlAdd"></VideoListDialog>
        </el-dialog>
      </el-form-item>

      <el-form-item style="margin-top: 20px" label-width="100px" prop="name">
        <div>
          <el-button @click="submitComment1">提交点评</el-button>
          <el-button>取消</el-button>
        </div>
      </el-form-item>
    </el-form>

  </div>

</template>

<script>
import Recorder from 'js-audio-recorder'
import ImgListDialog from '@/components/ImgListDialog'
import VideoListDialog from '@/components/VideoListDialog'
import AudioListDialog from '@/components/AudioListDialog'
import { submitComment } from '@/api/homeWorkFunc'

const lamejs = require('lamejs')

export default {
  name: 'CommentForm',
  props:['commentId'],
  components: {
    ImgListDialog,
    VideoListDialog,
    AudioListDialog
  },
  data () {
    return {
      // 存放本地file 文件
      imgList: [],
      audioList: [],
      vedioList: [],
      recoderList: [], // mp3 格式的blob数据
      // 存放url
      recoderUrlList: [],
      imgUrlList: [],
      audioUrlList: [],
      vedioUrlList: [],
      isShowDialog: false,
      isShowAudioList: false,
      isShowVideoList: false,
      isShowImgList: false,
      isShowRecorder: false,
      form: {},
      startValue: null,
      recorder: null,
      isStopRecorder: false,
      isStartRecorder: true
    }
  },
  created () {
    this.recorder = new Recorder({
      sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
      sampleRate: 48000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1 // 声道，支持 1 或 2， 默认是1
      // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
    })
    window.recorder = this.recorder
  },
  methods: {
    submitComment1 () {
      const formData = new FormData()
      // 封装上传的音频文件数据
      this.audioList.forEach(file => {
        formData.append('files', file.raw)
      })
      // 封装上传的图片
      this.imgList.forEach(file => {
        formData.append('files', file.raw)
      })
      formData.append('desc', this.form.desc)
      formData.append('startValue', this.form.startValue)
      console.log('submitCommitBefore', formData)
      const data = submitComment(formData)
      console.log('submitCommit', data)
    },
    submitComment () {
      const formData = new FormData()
      // 封装录音数据, 录音数据因为是本地的所以没有url 只有blob数据
      this.recoderList.forEach(blob => { // 循环变量所有的录音，并且添加到formDate中去
        const tmpRecoderFile = new File([blob], new Date().getTime() + '.mp3')
        formData.append('files', tmpRecoderFile)
      })
      // 封装上传的音频文件数据
      this.audioList.forEach(file => {
        formData.append('files', file.raw)
      })

      // 封装上传的视频
      this.vedioList.forEach(file => {
        formData.append('files', file.raw)
      })

      // 封装上传的图片
      this.imgList.forEach(file => {
        formData.append('files', file.raw)
      })

      // 素材库的图片 音频 视频
      this.imgUrlList.forEach(url => {
        formData.append('imgUrlList', url)
      })
      this.audioUrlList.forEach(url => {
        formData.append('audioUrlList', url)
      })
      this.vedioUrlList.forEach(url => {
        formData.append('vedioUrlList', url)
      })
      formData.append('desc', this.form.desc)
      formData.append('startValue', this.form.startValue)

      formData.append('commentId', this.commentId)
      const data = submitComment(formData)
      console.log('submitCommit', data)
    },
    removeAudio (url) {
      const i = this.audioUrlList.indexOf(url)
      this.audioUrlList.splice(i, 1)
    },
    removeImg (url) {
      const i = this.imgUrlList.indexOf(url)
      this.imgUrlList.splice(i, 1)
    },
    removeVedio (url) {
      const i = this.vedioUrlList.indexOf(url)
      this.vedioUrlList.splice(i, 1)
    },
    videoAdd (file) {
      console.log('file', file)
      // 把上传的本地文件 转换成url 进行显示
      const blob = new Blob([file.raw], { type: file.raw.type })
      const url = URL.createObjectURL(blob)
      this.vedioUrlList.push(url)
      this.vedioList.push(file)
      // this.imgList = fileList
      // fileList.forEach((item) => {
      //   console.log('imgitem', item)
      //   const file = item.raw
      //   const blob = new Blob([file], { type: 'image/mp4' })
      //   const url = URL.createObjectURL(blob)
      //   // this.audioUrlList.push(url)
      //   this.vedioUrlList.push(url)
      // })
    },
    videoUrlAdd (vedioUrlList) {
      vedioUrlList.forEach(item => {
        this.vedioUrlList.push(item)
      })
      this.isShowDialog = false
    },
    audioAdd (file) {
      // 把上传的本地文件 转换成url 进行显示
      const blob = new Blob([file.raw], {
        type: file.raw.type,
        fileName: file.raw.name
      })
      console.log('this is audio blob', blob)
      const url = URL.createObjectURL(blob)
      this.audioUrlList.push(url)
      // this.audioList.push(file.raw)
      // const map = new Map()
      // map.set(file.raw.name, file.raw)
      this.audioList.push(file)
    },
    audioUrlAdd (audioUrlList) {
      audioUrlList.forEach(item => {
        this.audioUrlList.push(item)
      })
      // this.audioUrlList = audioUrlList
      this.isShowDialog = false
    },
    imgAdd (file) {
      console.log('file', file)
      // 把上传的本地文件 转换成url 进行显示
      const blob = new Blob([file.raw], { type: file.raw.type })
      const url = URL.createObjectURL(blob)
      this.imgUrlList.push(url)
      this.imgList.push(file)
    },
    imgUrlAdd (imgUrlList) {
      imgUrlList.forEach(item => {
        this.imgUrlList.push(item)
      })
      this.isShowDialog = false
    },
    // 统一把录音的文件转换成mp3格式
    useRecorder () {
      // 拿到mp3格式的blob数据
      const mp3Blob = this.convertToMp3(this.recorder.getWAV())
      // 把blob 数据转成url形式
      const audioUrl = URL.createObjectURL(mp3Blob)
      this.recoderUrlList.push(audioUrl)

      this.recoderList.push(mp3Blob)
    },
    cancelRecorder () {
      this.isStartRecorder = true
      this.isStopRecorder = false
      this.recorder.destroy() // 毁实例
    },
    handleDialogClose (done) {
      done()
    },
    showRecord () {
      this.isShowDialog = true
      this.isShowRecorder = true
      this.isShowAudioList = false
      this.isShowImgList = false
      this.isShowVideoList = false
    },
    showImgList () {
      this.isShowDialog = true
      this.isShowImgList = true
      this.isShowRecorder = false
      this.isShowAudioList = false
      this.isShowVideoList = false
    },
    showAudioList () {
      this.isShowDialog = true
      this.isShowAudioList = true
      this.isShowImgList = false
      this.isShowRecorder = false
      this.isShowVideoList = false
    },
    showVedioList () {
      this.isShowDialog = true
      this.isShowVideoList = true
      this.isShowAudioList = false
      this.isShowImgList = false
      this.isShowImgList = false
    },
    transferTime (second) {
      if (Number(second) && second > 0) {
        second = parseInt(second) // 舍去秒数以后的小数位
      } else {
        // return '00:00:00'
        return '00:00'
      }

      // 计算时分秒
      // let h, m, s
      // const m, s
      const s = second % 60
      const m = ((second - s) % 3600) / 60
      // h = parseInt(second / 3600)

      // 优化输出
      function fn (num) {
        return num >= 10 ? num : '0' + num
      }

      // return fn(h) + ':' + fn(m) + ':' + fn(s)
      return fn(m) + ':' + fn(s)
    },
    // 开始录音
    handleStart () {
      this.isStopRecorder = true
      this.isStartRecorder = false
      this.recorder = new Recorder()
      this.recorder.start().then(() => {
            console.log('开始录音了=========')
          },
          (error) => {
            console.log(error)
          }
      )
    },

    getMp3Data () {
      const mp3Blob = this.convertToMp3(this.recorder.getWAV())
      this.recorder.download(mp3Blob, 'recorder', 'mp3')
    },
    convertToMp3 (wavDataView) {
      // 获取wav头信息
      const wav = lamejs.WavHeader.readHeader(wavDataView) // 此处其实可以不用去读wav头信息，毕竟有对应的config配置
      const { channels, sampleRate } = wav
      const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128)
      // 获取左右通道数据
      const result = this.recorder.getChannelData()
      const buffer = []

      const leftData = result.left && new Int16Array(result.left.buffer, 0, result.left.byteLength / 2)
      const rightData = result.right && new Int16Array(result.right.buffer, 0, result.right.byteLength / 2)
      const remaining = leftData.length + (rightData ? rightData.length : 0)

      const maxSamples = 1152
      for (let i = 0; i < remaining; i += maxSamples) {
        const left = leftData.subarray(i, i + maxSamples)
        let right = null
        let mp3buf = null

        if (channels === 2) {
          right = rightData.subarray(i, i + maxSamples)
          mp3buf = mp3enc.encodeBuffer(left, right)
        } else {
          mp3buf = mp3enc.encodeBuffer(left)
        }

        if (mp3buf.length > 0) {
          buffer.push(mp3buf)
        }
      }

      const enc = mp3enc.flush()

      if (enc.length > 0) {
        buffer.push(enc)
      }

      return new Blob(buffer, { type: 'audio/mp3' })
    },
    handleStop () {
      this.isStartRecorder = true
      this.isStopRecorder = false
      console.log('停止录音')
      this.recorder.stop() // 停止录音
    }
  }

}
</script>

<style scoped>
.recorderContent {
  line-height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /*align-items: flex-end;*/
  /*align-items: flex-start;*/
}

.audioCss {
  width: 250px;
  margin-bottom: 10px;;
  position: relative;
}

.removeAudio {
  position: absolute;
  right: 0;
  top: 5px;
}

.box {
  margin-right: 20px;
  font-size: 15px;
  color: #3d7dfd;
}

.imgCss {
  display: inline-block;
  margin-bottom: 10px;;
  width: 120px;
  height: 120px;
  position: relative;
}

.removeImg {
  position: absolute;
  right: 0px;
  top: 50px;
}

.removeVedio {
  position: absolute;
  right: 10px;
  top: 50px;
}
</style>
