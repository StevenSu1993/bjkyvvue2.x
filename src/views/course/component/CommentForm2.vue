<template>

  <div>
    <div style="font-size:14px">
      <h3>录音时长：{{ recorder && recorder.duration.toFixed(4) }}</h3>
      <br/>
      <el-button type="primary" @click="handleStart">开始录音</el-button>
      <el-button type="info" @click="handlePause">暂停录音</el-button>
      <el-button type="success" @click="handleResume">继续录音</el-button>
      <el-button type="warning" @click="handleStop">停止录音</el-button>
      <br/>
      <br/>
      <h3>
        播放时长：{{
          recorder &&
          (playTime > recorder.duration
              ? recorder.duration.toFixed(4)
              : playTime.toFixed(4))
        }}
      </h3>
      <br/>
      <el-button type="primary" @click="handlePlay">播放录音</el-button>
      <el-button type="info" @click="handlePausePlay">暂停播放</el-button>
      <el-button type="success" @click="handleResumePlay">继续播放</el-button>
      <el-button type="warning" @click="handleStopPlay">停止播放</el-button>
      <el-button type="error" @click="handleDestroy">销毁录音</el-button>
      <el-button type="primary" @click="uploadRecord">上传</el-button>
    </div>
  </div>
</template>

<script>
import Recorder from 'js-audio-recorder'

export default {
  name: 'CommentForm',
  data () {
    return {
      startValue: null,
      form: {},
      recorder: null,
      playTime: 0,
      timer: null,
      src: null
    }
  },
  created () {
    this.recorder = new Recorder()
  },
  methods: {
    // 开始录音
    handleStart () {
      this.recorder = new Recorder()
      this.recorder.start().then(() => {
        // 开始录音
        console.log('开始录音了=========')
      },
      (error) => {
        // 出错了
        console.log(error)
      }
      )

      //
      // Recorder.getPermission().then(() => {
      //   console.log('开始录音')
      //   this.recorder.start() // 开始录音
      // }, (error) => {
      //   this.$message({
      //     message: '请先允许该网页使用麦克风',
      //     type: 'info'
      //   })
      //   console.log(`${error.name} : ${error.message}`)
      // })
    },
    handlePause () {
      console.log('暂停录音')
      this.recorder.pause() // 暂停录音
    },
    handleResume () {
      console.log('恢复录音')
      this.recorder.resume() // 恢复录音
    },
    handleStop () {
      console.log('停止录音')
      this.recorder.stop() // 停止录音
    },
    handlePlay () {
      console.log('播放录音')
      console.log(this.recorder)
      this.recorder.play() // 播放录音

      // 播放时长
      this.timer = setInterval(() => {
        try {
          this.playTime = this.recorder.getPlayTime()
        } catch (error) {
          this.timer = null
        }
      }, 100)
    },
    handlePausePlay () {
      console.log('暂停播放')
      this.recorder.pausePlay() // 暂停播放

      // 播放时长
      this.playTime = this.recorder.getPlayTime()
      this.time = null
    },
    handleResumePlay () {
      console.log('恢复播放')
      this.recorder.resumePlay() // 恢复播放

      // 播放时长
      this.timer = setInterval(() => {
        try {
          this.playTime = this.recorder.getPlayTime()
        } catch (error) {
          this.timer = null
        }
      }, 100)
    },
    handleStopPlay () {
      console.log('停止播放')
      this.recorder.stopPlay() // 停止播放

      // 播放时长
      this.playTime = this.recorder.getPlayTime()
      this.timer = null
    },
    handleDestroy () {
      console.log('销毁实例')
      this.recorder.destroy() // 毁实例
      this.timer = null
    },
    uploadRecord () {
      if (this.recorder == null || this.recorder.duration === 0) {
        this.$message({
          message: '请先录音',
          type: 'error'
        })
        return false
      }
      this.recorder.pause() // 暂停录音
      this.timer = null
      console.log('上传录音')// 上传录音

      const formData = new FormData()
      const blob = this.recorder.getWAVBlob()// 获取wav格式音频数据
      // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
      const newbolb = new Blob([blob], { type: 'audio/wav' })
      const fileOfBlob = new File([newbolb], new Date().getTime() + '.wav')
      formData.append('file', fileOfBlob)
      const url = window.URL.createObjectURL(fileOfBlob)
      this.src = url
      // const axios = require('axios')
      // axios.post(url, formData).then(res => {
      //   console.log(res.data.data[0].url)
      // })
    }
  }

}
</script>

<style scoped>
.iconfont {
  padding: 10px;
  color: #3d7dfd;
  font-size: 20px;
}
</style>
