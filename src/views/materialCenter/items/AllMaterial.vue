<template>
  <div>
    <!-- region 上传文件加模糊搜索-->
    <div class="context">
      <div class="head">
        <el-upload
            class="upload-demo"
            :data="upData"
            :action="upFileUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="onSuccess"
            multiple>
          <el-button size="small" type="primary">上传素材</el-button>
        </el-upload>

        <el-link style="margin-left: 20px" :underline="false" type="primary" @click="newFolder">新建文件夹</el-link>
        <el-dialog
            class="dialog"
            :visible.sync="showNewFolder"
            :before-close="handleDialogClose"
            width='680px'
            heigth="400px"
            top="15vh">

          <div class="treeContent">
            <el-tree
                class="elTree iconfont" :data="treeData"
                :props="defaultProps"
                highlight-current
                icon-class="icon-wenjianjia"
                @node-click="handleNodeClick"></el-tree>
            <el-button class="confirm" type="primary" icon="el-icon-check" @click="moveFolderConfirm">确认</el-button>
          </div>
        </el-dialog>
        <el-link style="margin-left: 20px" :disabled="disabled">重命名</el-link>
        <el-link style="margin-left: 20px" :disabled="disabled" @click="moveToFolder">移动到</el-link>
      </div>

      <div class="head">
        <el-button-group style="margin-left: 30px">
          <el-button type="primary" size="mini" plain @click="changRangBySelf">仅自己</el-button>
          <el-button type="primary" size="mini" plain @click="changRangByAll">全部</el-button>
        </el-button-group>
        <el-select ref="elSelect" placeholder="请选择" v-model="orderValue" size="mini"
                   style="width: 100px;margin-left: 30px" @click="orderBy">
          <el-option value="0" label="按名称"></el-option>
          <el-option value="1" label="按时间"></el-option>
        </el-select>

        <el-input v-model="materialName" placeholder="请输入素材名称搜索" size="mini"
                  style="width:160px;;margin-left: 30px"></el-input>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchByLike">搜索</el-button>
      </div>

    </div>
    <!-- endregion -->
    <!--    第二行-->
    <div>
      <el-button style="border:none;margin-top:20px ;" plain>素材总数 : {{ materialTotal }}</el-button>
    </div>
    <!-- region 全选删除取消全选-->
    <div class="detailsHead">

      <el-button style="border:none;background: #F6F6F6" plain>已选择 : {{ checkTotal }}</el-button>

      <el-button style="border:none;background: #F6F6F6" plain>全选</el-button>

      <el-link :underline="false" @click="cancelAllChecked" style="margin-right: 20px;">取消全选</el-link>
      <el-link :underline="false" :disabled="disabled" @click="deleteByIds">删除</el-link>
    </div>

    <div v-if="showReturnToPreviousLevel">
      <el-link :underline="false" @click="returnToPreviousLevel" style="margin-left: 20px;margin-top: 10px;">返回上一级
      </el-link>
      <el-link :underline="false" style="margin-left: 10px;margin-top: 10px;">/{{ curentFolderName }}</el-link>
    </div>
    <!-- endregion -->
    <!-- region 内容展示-->
    <div ref="filesContent" class="details" id="container" v-show="show">
      <!--判断是否要创建新的文件夹-->
      <Detail ref="Detail"
              v-if="createFolder"
              :canDelete="canDelete"
              :fileType="7"
              :isFolder=true
              :isNewFolder=true
              :parentFolderId="curentFolderId"
              :refreshPage="refreshPage"
              :src='folderImg'/>

      <!--src 这样传值是因为vue配置了动态代理-->
      <Detail ref="Detail" :canDelete="canDelete"
              v-for="item in fileData" :key="item.id"
              :fileId="item.id"
              :fileType="item.type"
              :isFolder="item.isFolder"
              :src='"api/" + item.uuidFileName'
              :fileName="item.fileName"
              :refreshPage="refreshPage"
              :parentFolderId="item.parentFolderId"
              :isNewFolder=false
              :uuidFileName="item.uuidFileName"/>

    </div>
    <!-- endregion -->
    <!-- region 分页-->
    <Pagination class="pagination" v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- endregion -->
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import Detail from '@/views/materialCenter/items/Detail'
import { uuidByTime } from '@/utils/createUuid'

export default {
  name: 'AllMaterial',
  components: {
    Detail,
    Pagination
  },
  data () {
    return {
      // 展示内容参数
      show: false,
      disabled: true,
      orderValue: '',
      checkTotal: '',
      materialName: '',
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
      folderGrade: 2,
      directoryId: '',
      parentFolderId: '',
      formInline: {},

      // #region 新建文件夹需要的参数
      // folderList: [],
      folderImg: 'folder.png',

      createFolder: false,
      // #endregion

      // 新建文件加参数
      folderList: [],
      showNewFolder: false,
      curentFolderName: '',
      curentFolderId: '',
      finalFolderId: '',
      showReturnToPreviousLevel: false,
      defaultProps: {
        children: 'childrenFolder',
        label: 'fileName'
      },
      querys: [],
      UUID: {
        get: function () {
          return uuidByTime()
        }
      },
      treeData: []
    }
  },

  watch: {
    fileIds: {
      immediate: true, // 初始化时让handler调用一下
      // handler什么时候调用？当fileIds发生改变时。
      handler (newValue, oldValue) {
        this.disabled = this.fileIds.length === 0
        this.checkTotal = this.fileIds.length
      }
    },
    orderValue: {
      // handler什么时候调用？当fileIds发生改变时。
      handler (newValue, oldValue) {
        // 可以通过监视某个组件的值的变化去发送请求。渲染界面
        console.log(this.orderValue)
      }
    }
  },
  computed: {
    headers: {
      get () {
        return {
          Authorization: getToken()
        }
      }
    },
    upData: {
      get () {
        return {
          curentFolderId: this.curentFolderId
        }
      }
    },
    uuid: {
      get () {
        return uuidByTime()
      }
    },

    deFaultQueryData: {
      get () {
        return {
          start: this.pageparm.currentPage,
          size: this.pageparm.pageSize,
          type: 0, // 0 所有文件 1 表示图片,2 表示文档,3 表示视频,4 表示种子,5 表示音乐,6 表示其它
          rang: this.rang,
          orderValue: this.orderValue
        }
      }
    }

  },
  methods: {
    orderBy () {
    },
    // #region 新建文件夹操作
    // 放回上一层目录
    returnToPreviousLevel () {
      // 第一步获取当前目录的上一级id
      const promise = new Promise((resolve, reject) => {
        this.$request.get('api/auth/getParentFolderId', {
          params: {
            curentFolderId: this.curentFolderId
          }
        }).then(res => {
          resolve(res.data.data.parentFolderId)
        })
      })
      // 第二： 根据获得的目录的上一级目录进行后续查询
      promise.then(parentFolderId => {
        const params = { ...this.deFaultQueryData }
        params.parentFolderId = parentFolderId
        params.orderValue = 1
        this.initData('api/auth/getFileByType', params)
      })
    },
    // 双击进入到某个文件夹
    refreshPage (curentFileId, fileName) {
      // 在创建了文件夹以后，双击进入到文件的时候要把createFolder 改为false , 否则创建的文件夹一直显示
      this.createFolder = false
      this.curentFolderId = curentFileId
      this.curentFolderName = fileName
      const params = { ...this.deFaultQueryData }
      params.parentFolderId = curentFileId
      params.orderValue = 1
      this.initData('api/auth/getFileByType', params)
    },
    newFolder () {
      this.createFolder = true
    },
    // #endregion
    // #region  移动文件到文件夹中
    handleNodeClick (data) {
      // 清空原有的数组
      this.querys = []
      this.querys.push(data.id)
    },
    moveFolderConfirm () {
      // 通知后端服务器去更新数据
      this.$request('/api/auth/moveFileToFolder', {
        params: {
          ids: this.fileIds + '', // 传递数据的时候加个'' 就能解决
          to: this.querys[0]
        }
      }).then(res => {
        this.showNewFolder = false
        this.search()
      })
    },
    handleDialogClose (done) {
      done()
    },
    moveToFolder () {
      // 从后端获取数据用来展示tree
      this.$request.get('/api/auth/getAllFolder').then(res => {
        this.showNewFolder = true
        // 这里有个不好的样式就是默认情况下。 叶子节点是没有任何图标的
        this.treeData = res.data.data
      })
    },
    // #endregion
    // 上传文件
    onSuccess () {
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      this.search()
    },
    // 取消全部选择
    cancelAllChecked () {
      this.fileIds = []
      // 通过组价事件触发机制 也可以使用refs 直接获取组件进行属性的修改
      this.$refs.Detail.forEach(item => {
        item.$emit('canceCheck')
      })
    },
    // 模糊搜索
    changRangBySelf () {
      this.rang = 1
    },
    changRangByAll () {
      this.rang = 0
    },

    // 删除按钮的联动功能
    canDelete (isDisable, fileId) {
      // 让删除按钮变的可用
      if (isDisable) {
        this.fileIds.push(fileId)
      } else {
        // indexof 删除 更方便
        const i = this.fileIds.indexOf(fileId)
        this.fileIds.splice(i, 1)
      }
    },
    // 删除文件
    async deleteByIds () {
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
              instance.confirmButtonLoading = false
              done()
              this.fileIds = []
              // 刷新页面
              this.search()
            })
          } else {
            instance.confirmButtonLoading = false
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
    callFather (pageparm) {
      console.log('pageparm的值为', pageparm)
      const params = { ...this.deFaultQueryData }
      params.start = pageparm.currentPage
      params.pageSize = pageparm.pageSize
      params.parentFolderId = this.curentFolderId
      if (this.materialName.length > 0) {
        params.name = this.materialName
        params.excludeFolder = true
      }
      // TODO去后端获取数据
      this.initData('api/auth/getFileByNameAndSort', params)
    },

    // 页面初始化
    async initData (url, params) {
      await this.$request(url, { params: params }).then(res => {
        this.fileData = res.data.data.records
        this.fileTotal = res.data.data.total
        this.pageparm.total = res.data.data.total
        if (res.data.data.total > 0) {
          // this.curentFolderParentFolderId = res.data.data.records[0].parentFolderId
          this.curentFolderId = res.data.data.records[0].parentFolderId
          if (res.data.data.records[0].parentFolderId === this.finalFolderId) {
            this.showReturnToPreviousLevel = false
          } else {
            this.showReturnToPreviousLevel = true
          }
        } else {
          this.showReturnToPreviousLevel = true
        }
        // 模糊搜索不需要显示返回上一级
        if (this.materialName.length > 0) {
          this.showReturnToPreviousLevel = false
        }
        this.show = true
      })
    },
    search () {
      const params = { ...this.deFaultQueryData }
      params.name = this.materialName
      params.parentFolderId = this.curentFolderId

      // 根据时间或者名称排序，
      this.initData('api/auth/getFileByNameAndSort', params)
    },

    searchByLike () {
      const params = { ...this.deFaultQueryData }
      // 根据时间或者名称排序，
      if (this.materialName.length > 0) {
        params.name = this.materialName
        params.excludeFolder = true
      } else {
        params.folderGrade = 2
        delete params.name
        delete params.excludeFolder
      }
      this.initData('api/auth/getFileByNameAndSort', params)
    }
  },
  // created 声明周期钩子
  created () {
    const params = { ...this.deFaultQueryData }
    params.folderGrade = 2
    params.isCreated = true
    // 页面以初始化的情况下就按照时间进行排序
    params.orderValue = 1
    this.$request('api/auth/getFileByType', {
      params
    }).then(res => {
      this.fileData = res.data.data.records
      this.fileTotal = res.data.data.total
      this.pageparm.total = res.data.data.total
      if (res.data.data.total > 0) {
        // 默认查询的就是素材库下的内容。 所以当前文件夹应该为 素材库的文件夹
        this.curentFolderId = this.finalFolderId = res.data.data.records[0].parentFolderId
        // this.curentFolderParentFolderId = res.data.data.records[0].parentFolderId
      }
      this.show = true
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
  flex-flow: wrap;
  /*justify-content: space-between;*/
}

.pagination {

  margin-top: 200px;
}

/* region 修改el-tree样式 */
/*修改标签字体大小*/
.elTree ::v-deep .el-tree-node__label {
  font-size: 18px;
}

/*鼠标放到标题上的颜色*/
.elTree ::v-deep .el-tree-node__label:hover {
  background: #EDF4FF;
}

/*修改icon大小*/
.elTree ::v-deep .el-tree-node__expand-icon {
  font-size: 20px;
}

/*更改icon的颜色。 因为只有使用<svg>引入的方式才能有颜色，但是又想设置颜色，就得scope穿透了*/
::v-deep .icon-wenjianjia {
  color: #FFD557;
}

.treeContent {
  border: 1px solid gainsboro;
  /*background: lightcoral;*/
  position: relative;
  margin: 0 auto;
  height: 400px;
  width: 400px;
}

.elTree {
  margin: 0 auto;
  /*background: red;*/

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
  width: 80px;
}

/* endregion xxxx */
</style>
