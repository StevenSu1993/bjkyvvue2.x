<template>

  <div>

    <div class="context">
      <div class="head">
        <el-button style="border:none" plain>图片总数 : {{ coureTotal }}</el-button>
        <el-link :underline="false" :disabled="disabled" @click="deleteByIds">删除</el-link>
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

        <el-input v-model=" materialName" placeholder="请输入图片名称搜索" size="mini"
                  style="width:160px;;margin-left: 30px"></el-input>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
      </div>

    </div>

    <div class="detailsHead">
      <el-button style="border:none;background: #F6F6F6" plain>已选择 : {{ checkTotal }}</el-button>
      <el-link :underline="false" @click="cancelAllChecked">取消全选</el-link>
    </div>

    <!--    展示内容-->
    <div class="details" v-show="show">
      <!--      src 这样传值是因为vue配置了动态代理-->
      <ImgDetail ref="imgDetail" :canDelete="canDelete"
                 v-for="item in fileData" :key="item.id"
                 :fileId="item.id" :src="item.uuidFileName"
                 :fileName="item.fileName" :uuidFileName="item.uuidFileName">

        <template slot="content">
          <object :data='"api/" + item.uuidFileName' width="110px" height="110px"></object>
<!--                    <el-image :src='"api/" + item.uuidFileName' fit="fit"></el-image>-->
        </template>
      </ImgDetail>
    </div>

    <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>

</template>

<script>
import ImgDetail from '@/views/materialCenter/items/Detail'
import Pagination from '@/components/Pagination'

export default {
  name: 'UpImg',
  components: {
    ImgDetail,
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
      rang: ''
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
  created () {
    this.initData('api/auth/getFileByType', {
      start: 0,
      size: 10,
      type: 1
    })
  },
  methods: {
    callFather () {
      console.log('parm的值为', parm)
      const params = {
        start: parm.currentPage,
        size: parm.pageSize,
        type: 1, // 1 表示图片,2 表示文档,3 表示视频,4 表示种子,5 表示音乐,6 表示其它
        rang: this.rang,
        orderValue: this.orderValue
      }
      if (this.imageName != null) {
        params.name = this.imageName
      }
      // TODO去后端获取数据
      this.initData('api/auth/getFileByNameAndSort', params)
    },

    initData (url, params) {
      this.$request(url, { params: params }).then(res => {
        // console.log(res.data.data)
        this.fileData = res.data.data.records
        this.fileTotal = res.data.data.total
        this.pageparm.total = res.data.data.total
        this.show = true
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
        // js 中删除属性只能用 spilice
        /* for (let i = 0; i < this.fileIds.length; i++) {
              if (this.fileIds[i] === fileId){
                this.fileIds.splice(i, 1);
              }
        } */
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
                ids: this.fileIds + ''// 传递数组的时候加个''可以解决传递参数错爱
              }
            }).then(res => {
              instance.confirmButtonLoading = false
              done()
              // 删除完以后重新获取数据
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
    search () {
      // 根据时间或者名称排序，
      this.initData('api/auth/getFileByNameAndSort', {
        start: this.pageparm.currentPage,
        size: this.pageparm.pageSize,
        type: 1, // 1 表示图片,2 表示文档,3 表示视频,4 表示种子,5 表示音乐,6 表示其它
        name: this.imageName,
        rang: this.rang,
        orderValue: this.orderValue
      })
    },
    cancelAllChecked () {
      // 通过组价事件触发机制 也可以使用refs 直接获取组件进行属性的修改
      this.$refs.imgDetail.forEach(item => {
        item.$emit('canceCheck')
      })
      // this.$emit('canceCheck', true)

      /* 通过子组件的vuecompent 对象直接修改其属性值
      console.log(this.$refs.checkTest)
       let items = this.$refs.checkTest
       items.checked = false */
    },
    onchecked (emit) {
      console.log('this is emit', emit.target.value)
    }
  }
}
</script>

<style scoped>
.context {
  display: flex;
  justify-content: space-between;
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
