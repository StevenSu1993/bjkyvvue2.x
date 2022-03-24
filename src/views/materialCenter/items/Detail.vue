<template>
  <div class="details">
    <div class="itemCheck">
      <input ref="checkTest"
             type="checkbox"
             name="checkbox"
             :model="checked"
             :value="fileId"
             @change="onchecked"/>

    </div>
    <div class="itemContent">

      <!-- 0 所有文件 1 表示图片,2 表示文档,3 表示视频,4 表示种子,5 表示音乐,6 表示其它-->
      <el-image
          v-if="fileType === 1"
          fit="fit"
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

<!--      <audio-->
<!--          v-else-if = "fileType === 5"-->
<!--          :src='src'-->
<!--          style="width: 114px;height: 114px"-->
<!--          controls-->
<!--          :autoplay="false"/>-->
      <object v-else
              :data='src'
              style="width: 114px;height: 114px"/>
      <!--      <slot name="content"></slot>-->
      <!-- <el-image  :src="Decodedsrc"  fit="fit"></el-image>  &lt;!&ndash;fit="fit"&ndash;&gt;-->
      <span class="fNclass">{{ fileName }}</span>
    </div>
  </div>

</template>

<script>

export default {
  name: 'ImgDetail',
  props: ['fileId', 'src', 'fileType', 'fileName', 'uuidFileName', 'canDelete'],
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
      },
      // set什么时候调用? 当fullName被修改时。
      set (value) {
        console.log('set被调用了', value)
      }
    },

    currentTime: {
      get: function () {
        return Date.now()
      },
      // set什么时候调用? 当fullName被修改时。
      set (value) {
        console.log('set被调用了', value)
      }
    }

  },
  data () {
    return {
      checked: false,
      dialogVisible: false
    }
  },
  created () {
    console.log('this input id ', this.uuidFileName)
    this.$on('canceCheck', value => {
      this.checked = false
    })
  },
  methods: {
    handleClose (done) {
      done()
    },
    onchecked (emit) {
      // 当被选中的时候让父组件中的删除按钮可用
      this.canDelete(emit.target.checked, emit.target.value)
    },

    showDialog () {
      this.dialogVisible = true
      this.$refs.v1.pause()
    }
  },
  beforeDestroy () {
    console.log('allMaterial 销毁了')
    this.$off('canceCheck')
  }

}
</script>

<style scoped>

.details {
  margin-left: 20px;
  position: relative;
  margin-top: 20px;
  width: 120px;
  height: 166px;
  background: #F6F6F6;

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

.vcontent{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.v2{
  height: 450px;
  width: 450px;
}
.playButton{
  font-size: 40px;
  color: #65c9f4;
  position: absolute;

}

.fNclass{
  font-size: 12px;
  width: 120px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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

/*
input[type='checkbox']:checked + label::before {
  display: block;
  content: "\2714";
  text-align: center;
  font-size: 16px;
  color: white;
}

input[type='checkbox'] + label {
  display: block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
  background: #ADAEAF;
}

input[type='checkbox'] {
  display: none;
}*/

</style>
