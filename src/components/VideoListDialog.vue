<template>

  <div class="dialogContent">
    <el-upload
        class="upload-demo"
        :action="upFileUrl"
        :show-file-list="false"
        :auto-upload=false
        accept=".mp4"
        :on-change="uploadchange"
        multiple>
      <el-button size="mini" type="primary" style="margin-top: 20px">上传本地音频</el-button>
    </el-upload>
    <!--          <Detail></Detail>-->
    <div class="head">
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
    <div class="details">
      <VideoDetail ref="Detail" :addChildId="addChildId"
                   :removeChildId="removeChildId"
                   v-for="item in fileData" :key="item.id"
                   :fileId="item.id"
                   :src='"api/" + item.uuidFileName'
                   :url="item.url"
                   :fileName="item.fileName"
                   style="margin-bottom: 20px;"
      ></VideoDetail>

      <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      <el-button class="confirm" type="primary" icon="el-icon-check" @click="insertToHTML">插入正文</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import VideoDetail from '@/views/materialCenter/items/VideoDetail'

export default {
  name: 'MaterialListDialog',
  props: ['isShow', 'add', 'urlAdd'],
  components: {
    Pagination,
    VideoDetail
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
      upFileUrl: 'http://localhost:8090/auth/uploadFile',
      getAllFileUrl: 'api/auth/getAllFileByType',
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
    this.showVideo()
  },
  methods: {
    uploadchange (file, fileList) {
      this.add(file)
    },
    showVideo () {
      this.materialName = ''
      this.type = 3
      const params = { ...this.deFaultQueryData }
      params.type = 3
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
      this.urlAdd(this.filesUrlList)
      // 把filesUrlList 置null 是防止重复添加
      this.filesUrlList = []
      // 把选中元素的全部取消掉
      this.$refs.Detail.forEach(item => {
        item.$emit('canceCheck')
      })
    }
  }
}
</script>

<style scoped>
.upload-demo {
  display: inline-block;
}

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
  bottom: 2rem;
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
