<template>
  <div class="details">
    <div class="itemCheck">
      <input ref="checkTest"
             type="checkbox"
             name="checkbox"
             v-model="checked"
             :value="fileId"
             @change="onchecked"/>

    </div>
    <div class="itemContent">

      <!-- 0 所有文件 1 表示图片,2 表示文档,3 表示视频,4 表示种子,5 表示音乐,6 表示其它-->
      <el-image
          v-if="fileType === 1"
          fit="fill"
          style="width: 114px;height: 114px"
          :src="src"
          :preview-src-list="[src]"/>

      <div v-else-if="fileType === 3">
        <div class="vcontent">
          <!-- poster="1.jpeg" 自定义封面-->
          <video
              class="v1"
              style="width: 114px;height: 114px"
              ref="v1"
              @click.prevent="showDialog"
              :src="src"
              :autoplay="false"
          />
          <span class="playButton" @click.prevent="showDialog"><i class="el-icon-video-play "></i></span>
        </div>

        <el-dialog
            class="dialog"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width='680px'
            heigth="400px"
            top="15vh">
          <video
              class="v2"
              :src="src"
              controls
              controlsList='nodownload noremote footbar'
              :autoplay="true"
          />
        </el-dialog>
      </div>

      <div v-else-if="fileType === 5">
        <el-image
            fit="fit"
            style="width: 114px;height: 114px"
            @click.prevent="showDialog"
            src="music.png"/>

        <el-dialog
            class="dialog"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width='680px'
            heigth="400px"
            top="15vh">
          <audio
              class="v2"
              :src='src'
              controls
              controlsList='nodownload noremote footbar'
              :autoplay="false"/>
        </el-dialog>
      </div>

      <!-- 说明是文件夹-->
      <el-image v-else-if="fileType === 7"
                fit="fill"
                style="width: 114px;height: 114px"
                src="folder.png"
                @dblclick="openFolder"
      />
      <object v-else
              :data='src'
              style="width: 114px;height: 114px;display: block"/>
      <input v-if="isFolder && myIsNewFolder" type="text" class="folderName" @focus="onFocus"
             @blur="loseFocus"
             placeholder="文件夹名称"/>
      <span v-else class="fNclass">{{ myFileName }}</span>
    </div>
  </div>

</template>

<script>

export default {
  name: 'ImgDetail',
  props: ['fileId', 'src', 'fileType', 'fileName', 'uuidFileName', 'canDelete', 'isFolder', 'isNewFolder', 'parentFolderId', 'refreshPage'],
  computed: {
    Decodedsrc: {
      get: function () {
        /* 这里有个坑， 因为配置了代理会把路径拼接成 vue服务的路径 +  你给参数
        //比如： 你本地服务 http://localhost:9001  src 路径为        http://localhost:8090/1647806591575test%20-%20Copy%20(6).png
        最后拼接成
        http://localhost:9001/localhost:8090/1647806591575test%20-%20Copy%20(6).png
        然后就访问不到了
        配置了代理，正确访问的路径是 http://localhost:9001/1647806591575test%20-%20Copy%20(6).png
         */
        return 'api/' + this.src
      }
    },
    currentTime: {
      get: function () {
        return Date.now()
      }
    }

  },
  data () {
    return {
      checked: false,
      dialogVisible: false,
      // myIsFolder: this.isFolder,
      // myParentFolderId: this.parentFolderId,
      filesId: this.fileId,
      myIsNewFolder: this.isNewFolder,
      myFileName: this.fileName
    }
  },
  created () {
    this.$on('canceCheck', value => {
      this.checked = false
    })
  },
  methods: {
    openFolder () {
      // 调用父类刷新页面的函数去更新页面
      this.refreshPage(this.filesId, this.myFileName)
    },

    async loseFocus (val) {
      // 默认情况下文件都是素材库的子目录
      this.myFileName = val.target.value
      // #region 发送数据给后端让他创建目录
      await this.$request.get('api/auth/createFolder', {
        params: {
          // 文件名是必须的
          folderName: this.myFileName,
          isFolder: true,
          // 父id (父id 怎么拿呢？只能通过父组件传递过来)
          parentFolderId: this.parentFolderId
        }
      }).then(res => {
        this.filesId = res.data.data.id
        // 要失去焦点
        if (res.data.code === 400) {
          this.$message.info(res.data.data)
        } else {
          // 通知父类去更新目录
          this.refreshPage(this.parentFolderId, this.myFileName)
          this.$message.success('创建文件夹成功')
          this.myIsNewFolder = false
        }
      })
      console.log('创建成功')
      // #endregion
    },
    onFocus () {
    },
    handleClose (done) {
      done()
    },
    onchecked (emit) {
      // 当被选中的时候让父组件中的删除按钮可用
      console.log(emit)
      if (!emit.target.value.length > 0) {
        emit.target.value = this.filesId
      }
      this.canDelete(emit.target.checked, emit.target.value)
    },

    showDialog () {
      this.dialogVisible = true
      this.$refs.v1.pause()
    }
  },
  beforeDestroy () {
    this.$off('canceCheck')
  }

}
</script>

<style scoped>

/*region  内容样式布局 */

.details {
  margin-left: 20px;
  position: relative;
  margin-top: 20px;
  width: 120px;
  height: 166px;
  background: #F6F6F6;

  /*flex: 3 1 20%;*/

}

.itemCheck {
  background: #ADAEAF;
  position: absolute;
  float: right;
  right: 0;

}

.itemContent {
  padding: 0;
  text-align: center;
  margin-top: 30px;
  margin-right: 0;
  position: absolute;

}

.vcontent {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.v2 {
  height: 450px;
  width: 450px;
}

.playButton {
  font-size: 40px;
  color: #65c9f4;
  position: absolute;

}

/*endregion*/

/*region 文件名超出部分省略号显示 */
.fNclass {
  font-size: 12px;
  width: 120px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/*region  修改input输入框的样式 */
.folderName {
  /*region  清楚浏览器默认的样式 */
  -web-kit-appearance: none;
  -moz-appearance: none;
  /*endregion*/

  /*region  上边框和圆角，并设置input的高度和字体大小和颜色： */
  font-size: 12px;
  /*height:2.7em;*/
  width: 70px;
  border-radius: 4px;
  border: 1px solid #c8cccf;
  color: #6a6f77;
  /*endregion*/

  outline: 0;

}

/*region  修改输入框placehoder的颜色 */
::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #6a6f77;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #6a6f77;
}

input::-webkit-input-placeholder {
  color: #6a6f77;
}

/*endregion*/
/*endregion*/

</style>
