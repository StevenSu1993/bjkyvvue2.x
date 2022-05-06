<template>
  <div>

    <el-tabs lazy='true' v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="主题模板" name="first">

        <!-- region 第一行 新建文件夹 -->
        <div class="content-head">
          <div class="context">
            <el-button style="margin-left: 20px" size="mini" @click="newTemplate">新增模板</el-button>
            <el-link style="margin-left: 20px" :underline="false" type="primary" @click="newFolder">新建文件夹</el-link>
            <el-link style="margin-left: 20px" :disabled="disabled" :underline="false" @click="batchDelete">删除</el-link>
            <el-link style="margin-left: 20px" :disabled="disabled" :underline="false" @click="moveToFolder">移动到
            </el-link>
          </div>

          <el-dialog
              class="dialog"
              :visible.sync="newFolderVisible"
              :before-close="handleClose"
              width='366px'
              heigth="166px"
              append-to-body
              top="15vh">

            <div style="text-align: center">
              <el-button style="margin: 0 auto" type="text">新增文件夹</el-button>
              <el-input v-model="form.name" size="small" style="width: 290px;" placeholder="请输入名称"
                        maxlength="40" show-word-limit></el-input>
              <el-button type="primary" style="margin: 10px auto; " @click="onNewFolderSubmit(form)">确定</el-button>
            </div>
          </el-dialog>

          <el-dialog
              class="dialog"
              :visible.sync="showFolder"
              :before-close="handleClose"
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

            <el-input v-model="materialName" placeholder="请输入素材名称搜索" size="mini"
                      style="width:160px;;margin-left: 30px"></el-input>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchByLike">搜索</el-button>
          </div>

        </div>
        <!-- endregion -->
        <!-- region 第二行-->
        <div>
          <el-button style="border:none;margin-top:10px ;" plain>模版总数 : {{ templateTotal }}</el-button>
          <el-button style="border:none;margin-top:10px ;" plain>文件夹总数 : {{ templateFolderTotal }}</el-button>
        </div>
        <!-- endregion -->

        <!-- region 全选删除取消全选-->
        <div class="detailsHead">

          <el-button style="border:none;background: #F6F6F6" plain>已选择 : {{ checkTotal }}</el-button>

          <el-button style="border:none;background: #F6F6F6" plain @click="allCheck">全选</el-button>

          <el-button style="border:none;background: #F6F6F6" plain @click="cancelAllCheck">取消全选</el-button>

          <!--          <el-button style="border:none;background: #F6F6F6" plain>删除</el-button>-->

        </div>
        <div v-if="showReturnToPreviousLevel" style="background-color:#f6f6f6">
          <el-link :underline="false" @click="returnToPreviousLevel" style="margin-left: 20px;margin-top: 10px;">返回上一级
          </el-link>
          <el-link :underline="false" style="margin-left: 10px;margin-top: 10px;">/{{
              curentTemplateFolderName
            }}
          </el-link>
        </div>
        <!-- endregion -->
        <!--  最后一行内容展示-->
        <el-table ref="el-table" :data="tableData" size="small" stripe @selection-change="handleSelectionChange"
                  @row-dblclick="rowDBClick">
          <el-table-column type="selection" width="55"/>
          <!--          <el-table-column prop="name" label="模板名称"/>-->
          <el-table-column prop="name" label="模板名称">
            <template slot-scope="scope">
              <div v-if="!scope.row.isEditFolderName">
                <img v-if="scope.row.isFolder" class="img" src="folder.png">
                <span style="vertical-align: middle"> {{ scope.row.name }}</span>
              </div>

              <div v-if="scope.row.isEditFolderName" class="folderName">
                <img v-if="scope.row.isFolder" class="img" src="folder.png">
                <el-input v-model="scope.row.name" size="small" style="width: 290px;display: inline-block"
                          maxlength="40" show-word-limit></el-input>
                <span class="iconfont icon-gouxuan" style="color: #3d7dfd; margin-right: 5px;"
                      @click="confirmFolderName(scope.row)"></span>
                <span class="iconfont icon-guanbi" @click="cancelEditFolderName(scope.row)"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间" :formatter="formatDate"/>
          <el-table-column prop="creater" label="创建人"/>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div v-if="!scope.row.isFolder">
                <el-button type="text" size="mini" @click="handShowInfo(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </div>
              <div v-else>
                <el-button type="text" size="mini" @click="handShowInfoByFolder(scope.$index, scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </div>

            </template>
          </el-table-column>
        </el-table>
        <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dateFormat from '@/utils/dateFormat'
import Vue from 'vue'

export default {
  name: 'TemplateMaterial',
  components: {
    Pagination
  },
  data () {
    return {
      pageparm: {
        currentPage: 0,
        pageSize: 10,
        total: 0
      },
      rang: 0,
      templateTotal: '',
      templateFolderTotal: '',
      curentTemplateFolderName: '',
      curentFolderId: '',
      originalCurentFolderId: '',
      materialName: '',
      checkTotal: '',
      orderValue: '',
      tableData: [],
      disabled: false,
      activeName: 'first',
      newFolderVisible: false,
      form: {},
      showReturnToPreviousLevel: false,
      rules: {
        name: [
          {
            required: true,
            message: '请输入文件夹名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ]
      },
      showFolder: false,
      checkedRow: [],
      treeData: [],
      querys: [],
      defaultProps: {
        children: 'childrenFolder',
        label: 'name'
      }
    }
  },
  // watch: {
  //   checkedRow: {
  //     immediate: false, // 初始化时让handler调用一下
  //     // handler什么时候调用？当fileIds发生改变时。
  //     handler (newValue, oldValue) {
  //       this.disabled = this.checkedRow.length === 0
  //       // this.checkTotal = this.checkedRow.length
  //     }
  //   }
  // },
  computed: {
    deFaultQueryData: {
      get () {
        var params = {
          start: this.pageparm.currentPage,
          size: this.pageparm.pageSize,
          rang: this.rang,
          orderValue: this.orderValue
        }
        if (this.materialName.length > 0) {
          params.name = this.materialName
        }
        return params
      },
      set (oldValue, newValue) {
        // console.log(newValue)
      }
    }
  },
  mounted () {
    var params = { ...this.deFaultQueryData }
    params.folderGrade = 2
    this.initData(params).then(res => {
      this.originalCurentFolderId = this.curentFolderId
    })
  },
  methods: {
    batchDelete () {
      this.$request.post('/api/auth/deleteTemplateByIds', this.checkedRow).then(res => {
        this.$message.success('刪除成功')
        var params = { ...this.deFaultQueryData }
        // params.name = this.materialName
        params.parentFolderId = this.curentFolderId
        // 根据时间或者名称排序，
        this.initData(params)
      })
    },
    allCheck () {
      this.$refs['el-table'].toggleAllSelection()
    },
    cancelAllCheck () {
      this.$refs['el-table'].clearSelection()
    },
    moveFolderConfirm () {
      var templateIds = []
      this.checkedRow.forEach(row => {
        templateIds.push(row.id)
      })
      this.$request('/api/auth/moveTemplateToFolder', {
        params: {
          ids: templateIds + '', // 传递数据的时候加个'' 就能解决
          to: this.querys[0]
        }
      }).then(res => {
        this.showFolder = false
        var params = { ...this.deFaultQueryData }
        // params.name = this.materialName
        params.parentFolderId = this.curentFolderId
        // 根据时间或者名称排序，
        this.initData(params)
      })
      // console.log(this.checkedRow)
    },
    handleNodeClick (data) {
      this.querys = []
      this.querys.push(data.id)
    },
    formatDate (row) {
      return dateFormat('YYYY-mm-dd HH:MM', new Date(row.createTime))
    },
    callFather (pageparm) {
      // console.log('pageparm的值为', pageparm)
      const params = { ...this.deFaultQueryData }
      params.start = pageparm.currentPage
      params.pageSize = pageparm.pageSize
      params.parentFolderId = this.curentFolderId
      if (this.materialName.length > 0) {
        params.name = this.materialName
      }
      // TODO去后端获取数据
      this.initData(params)
    },
    handleSelectionChange (val) {
      this.disabled = val.length === 0
      this.checkedRow = val
      this.checkTotal = val.length
      // this.disabled = this.checkedRow.length === 0
      // console.log('val', val)
    },
    rowDBClick (row, column, event) {
      if (row.isFolder) {
        var params = { ...this.deFaultQueryData }
        // params.name = this.materialName
        params.parentFolderId = row.id
        this.initData(params)
        this.showReturnToPreviousLevel = true
        this.curentTemplateFolderName = row.name
      }
    },
    changRangBySelf () {
    },
    changRangByAll () {
    },
    searchByLike () {
      var params = { ...this.deFaultQueryData }
      params.parentFolderId = this.curentFolderId
      this.initData(params)
    },
    returnToPreviousLevel () {
      this.materialName = ''
      // console.log(this.curentFolderId)
      // 第一步获取当前目录的上一级id
      const promise = new Promise((resolve, reject) => {
        this.$request.get('api/auth/getTempalteParentFolderId', {
          params: {
            curentFolderId: this.curentFolderId
          }
        }).then(res => {
          resolve(res.data.data.parentFolderId)
        })
      })
      // 第二： 根据获得的目录的上一级目录进行后续查询
      promise.then(parentFolderId => {
        if (parentFolderId === this.originalCurentFolderId) {
          this.showReturnToPreviousLevel = false
        }
        var params = { ...this.deFaultQueryData }
        params.parentFolderId = parentFolderId
        this.initData(params)
      })
    },
    moveToFolder () {
      if (this.checkedRow.length > 0) {
        this.$request.get('api/auth/getAllTemplateFolder').then(res => {
          // console.log(res)
          this.showFolder = true
          // 这里有个不好的样式就是默认情况下。 叶子节点是没有任何图标的
          this.treeData = res.data.data
        })
      }
    },
    handleClick (tab, event) {
      // tab.$destroy()
      // console.log(tab, event)
    },
    newTemplate () {
      // this.$router.push('/newTemplateM')
      this.$router.push({
        name: '新建模板素材',
        params: {
          curentFolderId: this.curentFolderId
        }
      })
    },
    newFolder () {
      this.newFolderVisible = true
    },
    handleClose (done) {
      done()
    },
    // 新建模板的文件夹
    onNewFolderSubmit (formName) {
      this.form.parentFolderId = this.curentFolderId
      this.$request.post('/api/auth/createTemplateFolder', this.form).then(res => {
        // console.log(res)
        this.$message({
          type: 'success',
          message: '新建文件夹成功'
        })
      })
      var params = { ...this.deFaultQueryData }
      params.parentFolderId = this.curentFolderId
      this.initData(params)
      this.newFolderVisible = false
    },
    cancelEditFolderName (row) {
      Vue.set(row, 'isEditFolderName', false)
      row.name = row.oldFolderName
    },
    confirmFolderName (row) {
      this.$request.post('/api/auth/updateTemplate', row).then(res => {
        // console.log(res)
        this.$message.success('更新模板成功')
        Vue.set(row, 'isEditFolderName', false)
      })
    },
    handShowInfoByFolder (index, row) {
      // console.log(index)
      // row.isEditFolderName = true  必须使用vue。set 方式进行赋值。
      Vue.set(row, 'isEditFolderName', true)
      Vue.set(row, 'oldFolderName', row.name)
      // console.log('更改样式就行了', row)
    },
    handShowInfo (row) {
      // console.log(row)
      // this.$router.push({
      //   path: '/editorTemplate',
      //   query: {
      //     row
      //   }
      // })
      this.$router.push({
        name: 'editorTemplate',
        params: {
          row
        }
      })
    },
    handleDelete (index, row) {
      this.$request.post('/api/auth/deleteTemplate', row).then(res => {
        // console.log(res)
        this.$message.success('删除模板成功')
      })
      // 更新后显示要就parentFolderId
      var params = { ...this.deFaultQueryData }
      params.parentFolderId = this.curentFolderId
      this.initData(params)
    },
    initData (params) {
      return this.$request.get('/api/auth/getAllTemplate', { params }).then(res => {
        console.log(res)
        this.tableData = res.data.data.page.records
        this.templateTotal = res.data.data.countTemplate
        this.templateFolderTotal = res.data.data.countTemplateFolder
        if (res.data.data.page.total > 0) {
          this.curentFolderId = res.data.data.page.records[0].parentFolderId
          this.pageparm.total = res.data.data.page.total
        }
      })
    }
  }
}
</script>

<style scoped>

.content-head {
  display: flex;
  justify-content: space-between;
}

.detailsHead {
  background: #F6F6F6;
  margin: auto;
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

.img {
  height: 32px;
  width: auto;
  border-radius: 50%;
  /*display: inline-block;*/
  vertical-align: middle;
}

.folderName {
  display: flex;
  align-items: center;
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
