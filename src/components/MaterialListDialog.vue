<template>

  <div class="dialogContent">
    <el-button @click="showImg">图片</el-button>
    <el-button @click="showVideo">视频</el-button>
    <el-button @click="showAudio">音频</el-button>
    <!--          <Detail></Detail>-->
    <div class="head" v-if="isShowImg || isShowAudio || isShowVideo">
      <el-button-group style="margin-left: 30px">
        <el-button type="primary" size="mini" plain @click="changRangBySelf">仅自己</el-button>
        <el-button type="primary" size="mini" plain @click="changRangByAll">全部</el-button>
      </el-button-group>
      <el-select ref="elSelect" placeholder="请选择" v-model="orderValue" size="mini"
                 style="width: 100px;margin-left: 20px">
        <el-option value="0" label="按名称"></el-option>
        <el-option value="1" label="按时间"></el-option>
      </el-select>
      <el-input v-model="materialName" placeholder="请输入图片名称搜索"
                size="mini"
                style="width:160px;;margin-left: 20px"></el-input>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchByLike">搜索</el-button>
    </div>
    <div class="details" v-if="isShowImg">
      <ImgDetail ref="Detail" :addChildId="addChildId"
                 :removeChildId="removeChildId"
                 v-for="item in fileData" :key="item.id"
                 :fileId="item.id"
                 :src='"api/" + item.uuidFileName'
                 :url="item.url"
                 :fileName="item.fileName"
      ></ImgDetail>

      <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <el-button class="confirm" type="primary" icon="el-icon-check" @click="insertToHTML">插入正文</el-button>
    </div>
    <div class="details" v-if="isShowVideo">
      <VideoDetail ref="Detail" :addChildId="addChildId"
                   :removeChildId="removeChildId"
                   v-for="item in fileData" :key="item.id"
                   :fileId="item.id"
                   :src='"api/" + item.uuidFileName'
                   :url="item.url"
                   :fileName="item.fileName"
      ></VideoDetail>

      <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <el-button class="confirm" type="primary" icon="el-icon-check" @click="insertToHTML">插入正文</el-button>
    </div>
    <div class="details" v-if="isShowAudio">
      <AudioDetail ref="Detail" :addChildId="addChildId"
                   :removeChildId="removeChildId"
                   v-for="item in fileData" :key="item.id"
                   :fileId="item.id"
                   :src='"api/" + item.uuidFileName'
                   :url="item.url"
                   :fileName="item.fileName"
      ></AudioDetail>

      <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <el-button class="confirm" type="primary" icon="el-icon-check" @click="insertToHTML">插入正文</el-button>
    </div>
  </div>
</template>

<script>
import AudioDetail from '@/views/materialCenter/items/AudioDetail'
import ImgDetail from '@/views/materialCenter/items/ImgDetail'
import Pagination from '@/components/Pagination'
import VideoDetail from '@/views/materialCenter/items/VideoDetail'

export default {
  name: 'MaterialListDialog',
  props: ['isShow'],
  components: {
    ImgDetail,
    Pagination,
    VideoDetail,
    AudioDetail
  },
  computed: {
    deFaultQueryData: {
      get () {
        return {
          start: this.pageparm.currentPage,
          size: this.pageparm.pageSize,
          type: this.type, // 0 所有文件 1 表示图片,2 表示文档,3 表示视频,4 表示种子,5 表示音乐,6 表示其它
          rang: this.rang,
          orderValue: this.orderValue
        }
      },
      set (oldValue, newValue) {
        console.log(newValue)
      }
    },
    templateData: {
      get () {
        return {
          name: this.form.name,
          id: this.form.id,
          content: this.editor.txt.html()
        }
      }
    }
  },
  data () {
    return {
      // showDialog: true,
      getAllFileUrl: 'api/auth/getAllFileByType',
      isShowImg: false,
      isShowAudio: false,
      isShowVideo: false,
      pageparm: {
        currentPage: 0,
        pageSize: 10,
        total: 0
      },
      type: 0,
      orderValue: '',
      materialName: '',
      filesIdList: [],
      filesUrlList: [],
      fileData: [],
      fileTotal: ''
    }
  },
  mounted () {
    // this.showDialog = this.$props.isShow
  },
  methods: {
    handleDialogClose () {
      // this.showDialog = false
      this.isShowVideo = false
      this.isShowImg = false
      this.isShowAudio = false
    },
    showImg () {
      this.isShowVideo = false
      this.isShowAudio = false
      this.isShowImg = true
      this.type = 1
      // // 发送请求去获取后台数据
      const params = { ...this.deFaultQueryData }
      params.type = 1
      // // 页面以初始化的情况下就按照时间进行排序
      this.initData(params)
    },
    showVideo () {
      this.isShowAudio = false
      this.isShowImg = false
      this.isShowVideo = true
      this.type = 3
      const params = { ...this.deFaultQueryData }
      params.type = 3
      this.initData(params)
    },
    showAudio () {
      this.isShowVideo = false
      this.isShowImg = false
      this.isShowAudio = true
      this.type = 5
      const params = { ...this.deFaultQueryData }
      params.type = 5
      this.initData(params)
    },

    addChildId (childFilesId, childUrl) {
      console.log(childUrl)
      this.filesIdList.push(childFilesId)
      this.filesUrlList.push(childUrl)
    },
    removeChildId (childFilesId, childUrl) {
      const i = this.filesIdList.indexOf(childFilesId)
      this.filesIdList.splice(i, 1)
      const j = this.filesUrlList.indexOf(childUrl)
      this.filesUrlList.splice(j, 1)
    },
    changRangBySelf () {
    },
    changRangByAll () {
    },
    callFather (pageparm) {
      console.log('pageparm的值为', pageparm)
      const params = { ...this.deFaultQueryData }
      params.start = pageparm.currentPage
      params.pageSize = pageparm.pageSize
      if (this.materialName.length > 0) {
        params.name = this.materialName
      }
      // TODO去后端获取数据
      this.initData(params)
    },
    searchByLike () {
      console.log(this.deFaultQueryData)
      const params = { ...this.deFaultQueryData }
      if (this.materialName.length > 0) {
        params.name = this.materialName
      }
      this.initData(params)
    },
    initData (params) {
      this.$request(this.getAllFileUrl, {
        params
      }).then(res => {
        this.fileData = res.data.data.records
        this.fileTotal = res.data.data.total
        this.pageparm.total = res.data.data.total
      })
    },

    insertToHTML () {
      let html = ''
      if (this.isShowImg) {
        this.filesUrlList.forEach((item) => {
          html = `<br><img src="${item}" style="max-width:100%;" contenteditable="false" alt=""></br>`
          window.editor.cmd.do('insertHTML', html)
        })
      } else if (this.isShowVideo) {
        this.filesUrlList.forEach((item) => {
          html = `<br><video src="${item}" controls="controls" style="max-width:100%"></video></br>`
          window.editor.cmd.do('insertHTML', html)
        })
      } else {
        this.filesUrlList.forEach((item) => {
          html = `<br><audio src="${item}"  controls></audio><br/>`
          window.editor.cmd.do('insertHTML', html)
        })
      }
      this.$emit('closeDialogByFather', false)
      // 取消掉所有选中的
      this.$refs.Detail.forEach(item => {
        item.$emit('canceCheck')
      })
      this.filesUrlList = []
      this.filesIdList = []
      // this.editor.cmd.do('insertHTML', html)
    }
  }
}
</script>

<style scoped>

.dialogContent {
  height: 500px;
}

.confirm {
  position: absolute;
  bottom: 0.1rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: inline-block;
  /*background: lawngreen;*/

  height: 40px;
  width: 120px;
}

.pagination {
  position: absolute;
  bottom: 3rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: inline-block;
  text-align: center;
}

.head {
  margin-top: 15px;
  margin-bottom: 15px;
  float: right;
}

.details {
  clear: both;
  display: flex;
  flex-flow: wrap;
  /*justify-content: space-between;*/
}
</style>
