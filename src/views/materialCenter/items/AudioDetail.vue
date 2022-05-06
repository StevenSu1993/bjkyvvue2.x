<template>
  <div>

    <div class="details">
      <input ref="checkTest"
             type="checkbox"
             name="checkbox"
             v-model="checked"
             :value="fileId"
             @change="onchecked"/>

      <div>
        <el-image
            fit="fit"
            style="width: 110px;height: 110px"
            @click.prevent="showDialog"
            src="music.png"/>

        <el-dialog
            class="dialog"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width='680px'
            heigth="400px"
            append-to-body
            top="15vh">
          <audio
              class="v2"
              :src='src'
              controls
              controlsList='nodownload noremote footbar'
              :autoplay="false"/>
        </el-dialog>
      </div>

      <span class="fNclass">{{ fileName }}</span>

    </div>
  </div>
</template>

<script>
export default {
  name: 'AudioDetail',
  props: ['fileId', 'src', 'fileName', 'removeChildId', 'addChildId', 'url'],
  data () {
    return {
      checked: false,
      dialogVisible: false
    }
  },
  created () {
    this.$on('canceCheck', value => {
      this.checked = false
    })
  },
  methods: {
    onchecked () {
      if (this.checked) {
        this.addChildId(this.fileId, this.url)
      } else {
        this.removeChildId(this.checked, this.url)
      }
    },
    showDialog () {
      this.dialogVisible = true
    },
    handleClose (done) {
      done()
    },
  }
}
</script>

<style scoped>

::v-deep .el-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}

/*region  内容样式布局 */

.details {
  margin-left: 20px;
  position: relative;
  width: 110px;
  height: 166px;
  background: #F6F6F6;
  clear: both;
  /*flex: 3 1 20%;*/

}

/*region 文件名超出部分省略号显示 */
.fNclass {
  font-size: 12px;
  width: 120px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/*endregion*/

/*region 修改多选框样式 */
input[type="checkbox"] {
  outline: none;
  -webkit-appearance: none;
  background: #ADAEAF;
  cursor: pointer;
  height: 20px;
  width: 20px;
  display: inline-block;
  float: right;
  right: 0;
  margin-right: 0;
}

input[type="checkbox"]:checked {
  outline: none;
}

input[type="checkbox"]:checked::after {
  outline: none;
  display: block;
  content: '\2714';
  color: white;
  font-size: 16px;
  text-align: center;;
  vertical-align: middle;
}

/*endregion 修改多选框样式 */

</style>
