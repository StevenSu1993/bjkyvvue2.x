<template>
<div>
  <div class="childDialog">
    <el-dialog
        class="dialog"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width='680px'
        heigth="400px"
        append-to-body
        top="15vh">
      <video
          class="v2"
          :src="fileurl"
          controls
          controlsList='nodownload noremote footbar'
          :autoplay="true"
      />
    </el-dialog>
  </div>

  <div class="vcontent">
    <video
        class="v1"
        style="width: 100%;height: 100%"
        ref="v1"
        @click.prevent="showDialog"
        :src="fileurl"
        :autoplay="false"
    />
    <span class="playButton" @click.prevent="showDialog"><i class="el-icon-video-play "></i></span>
  </div>

</div>
</template>

<script>
export default {
  name: 'simpleVedio',
  props: ['fileurl'],
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
      this.$refs.v1.pause()
    },
    handleClose (done) {
      done()
    }
  }
}
</script>

<style scoped>

.vcontent {
  padding: 0;
  width: 110px;
  height: 110px;
  clear: both;
  position: relative;
}

.playButton {
  height: 40px;
  width: 40px;
  font-size: 40px;
  display: block;
  color: #65c9f4;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

}

::v-deep .el-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.v2 {
  height: 450px;
  width: 450px;
  /*margin-left: 116px;*/
}

</style>
