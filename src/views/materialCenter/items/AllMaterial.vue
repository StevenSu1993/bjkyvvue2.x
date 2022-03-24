<template>
  <div>
    <!--    第一行-->
    <div class="context">
      <div class="head">
        <el-upload
            class="upload-demo"
            :action="upFileUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="onSuccess"
            multiple>
          <el-button size="small" type="primary">上传素材</el-button>
        </el-upload>

        <!--      <el-button style="border:none" plain @click="upFile"> 批量上传</el-button>-->
        <el-link style="margin-left: 20px" disabled>新建文件夹</el-link>
        <el-link style="margin-left: 20px" disabled>删除</el-link>
        <el-link style="margin-left: 20px" disabled>重命名</el-link>
        <el-link style="margin-left: 20px" disabled>移动到</el-link>
      </div>

      <div class="head">
        <el-button-group style="margin-left: 30px">
          <el-button type="primary" size="mini" plain @click="changRangBySelf">仅自己</el-button>
          <el-button type="primary" size="mini" plain @click="changRangByAll">全部</el-button>
        </el-button-group>
        <el-select ref="elSelect" placeholder="请选择" v-model="orderValue" size="mini"
                   style="width: 100px;margin-left: 30px">
          <el-option value="0" label="按名称"></el-option>
          <el-option value="1" label="按时间"></el-option>
        </el-select>

        <el-input v-model="imageName" placeholder="请输入图片名称搜索" size="mini"
                  style="width:160px;;margin-left: 30px"></el-input>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
      </div>

    </div>
    <!--    第二行-->
    <div>
      <el-button style="border:none;margin-top:20px ;" plain>素材总数 : {{ materialTotal }}</el-button>
    </div>
    <!--    第三行全选 取消全选-->
    <div class="detailsHead">

      <el-button style="border:none;background: #F6F6F6" plain>已选择 : {{ checkTotal }}</el-button>

      <el-button style="border:none;background: #F6F6F6" plain>全选</el-button>

      <el-link :underline="false" @click="cancelAllChecked" style="margin-right: 20px;">取消全选</el-link>
      <el-link :underline="false" :disabled="disabled" @click="deleteByIds">删除</el-link>
    </div>
    <!--    展示内容-->
    <div class="details" v-show="show">
      <!--      src 这样传值是因为vue配置了动态代理-->
      <Detail ref="Detail" :canDelete="canDelete"
              v-for="item in fileData" :key="item.id"
              :fileId="item.id"
              :fileType="item.type"
              :src='"api/" + item.uuidFileName'
              :fileName="item.fileName"
              :uuidFileName="item.uuidFileName"/>

    </div>

    <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import Detail from '@/views/materialCenter/items/Detail'

export default {
  name: 'AllMaterial',
  components: {
    Detail,
    Pagination
  },
  data () {
    return {
      show: false,
      disabled: true,
      orderValue: '',
      checkTotal: '',
      imageName: '',
      checkList: ['选中且禁用', '复选框 A'],
      coureTotal: '',
      fileIds: [],
      fileData: [],
      fileTotal: '',
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      // 仅自己还是全部 1：自己， 0：all
      rang: '',
      upFileUrl: 'http://localhost:8090/auth/uploadFile',
      materialTotal: '',

      formInline: {}
    }
  },
  watch: {
    fileIds: {
      immediate: true, // 初始化时让handler调用一下
      // handler什么时候调用？当fileIds发生改变时。
      handler (newValue, oldValue) {
        this.disabled = this.fileIds.length === 0
        this.checkTotal = this.fileIds.length
        // console.log('disabled', newValue, oldValue)
      }
    }
  },
  computed: {
    headers: {
      get () {
        console.log('get被调用了')
        // console.log(this) //此处的this是vm
        return {
          Authorization: getToken()
        }
      },
      // set什么时候调用? 当fullName被修改时。
      set (value) {
        console.log('set被调用了', value)
      }
    }

  },
  methods: {
    onSuccess () {
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      this.search()
    },
    cancelAllChecked () {
      this.fileIds = []
      // 通过组价事件触发机制 也可以使用refs 直接获取组件进行属性的修改
      this.$refs.Detail.forEach(item => {
        item.$emit('canceCheck')
      })
    },

    changRangBySelf () {
      this.rang = 1
    },
    changRangByAll () {
      this.rang = 0
    },
    canDelete (isDisable, fileId) {
      // 让删除按钮变的可用
      console.log('这是从子组件传递过来的值', isDisable)
      if (isDisable) {
        this.fileIds.push(fileId)
      } else {
        // indexof 删除 更方便
        const i = this.fileIds.indexOf(fileId)
        this.fileIds.splice(i, 1)
      }
      console.log('fileIds 现在有的值为', this.fileIds)
    },
    deleteByIds () {
      this.$alert('确定要删除选中的文件吗', '删除文件', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            await this.$request('api/auth/deleteFileByIds', {
              params: {
                ids: this.fileIds + ''
              }
            }).then(res => {
              console.log(res)
              instance.confirmButtonLoading = false
              done()
              this.fileIds = []
              this.search()
            })
          } else {
            done()
          }
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    },
    callFather () {
    },
    async initData (url, params) {
      await this.$request(url, { params: params }).then(res => {
        console.log('this is allmaterial 获取到的数据', res.data.data)
        this.fileData = res.data.data.records
        this.fileTotal = res.data.data.total
        this.pageparm.total = res.data.data.total
        this.show = true
      })
    },
    search () {
      // 根据时间或者名称排序，
      this.initData('api/auth/getFileByNameAndSort', {
        start: this.pageparm.currentPage,
        size: this.pageparm.pageSize,
        type: 0, // 0 所有文件 1 表示图片,2 表示文档,3 表示视频,4 表示种子,5 表示音乐,6 表示其它
        name: this.imageName,
        rang: this.rang,
        orderValue: this.orderValue
      })
    },
    upFile () {
    },
    onchecked () {
    }
  },
  created () {
    console.log('allMaterial 被创建了')
    this.initData('api/auth/getFileByType', {
      start: 0,
      size: 10,
      type: 0
    })
  }
}
</script>

<style scoped>
.context {
  display: flex;
  justify-content: space-between;
}

.upload-demo {
  display: inline-block;
}

.detailsHead {
  background: #F6F6F6;

}

.details {
  display: flex;
  justify-content: space-between;
}

.pagination {

  margin-top: 200px;
}

</style>
