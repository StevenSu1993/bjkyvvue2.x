<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">
        <el-button type="text">首页</el-button>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-button type="text" disabled>作业课程</el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>


    <el-row style="padding: 20px">
      <el-button type="primary" plain @click="newCourse">新建课程</el-button>
      <el-button plain @click="batchAddManager">批量添加课程管理员</el-button>
      <el-button type="text" style="border:none" plain>课程总数 : {{ coureTotal }}</el-button>
    </el-row>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.courseName" placeholder="请输入课程名或创建人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

    <!--    数据展示列表-->
    <el-table :data="tableData" stripe v-show="show">
      <el-table-column prop="name" label="课程名称" width="140">
      </el-table-column>
      <el-table-column prop="countPratice" label="作业主题数" width="140">
      </el-table-column>
      <el-table-column prop="countUser" label="学员数" width="140">
      </el-table-column>
      <el-table-column prop="countSubmit" label="作业提交数" width="140">
      </el-table-column>
      <el-table-column prop="creator" label="创建人" width="140">
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">分享</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">学员管理</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">更多</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 这里还有点问题还需要好好写写-->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>

  </div>
</template>

<script>

import Pagination from '../../components/Pagination'

export default {
  name: 'Work',
  components: {
    Pagination
  },
  data () {
    const item = {
      courseName: '口语纠音课',
      countPratice: 14,
      countUser: 12,
      countSubmit: 130,
      userName: 'steven'
    }

    return {
      show: true,
      coureTotal: 0,
      tableData: [],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      formInline: {
        page: 1,
        limit: 10,
        courseName: '',
        varLable: '',
        varName: '',
        token: localStorage.getItem('logintoken')
      },
      // tableData: Array(10).fill(item),
    }

  },

  methods: {
    getdata: async function (parameter) {
      //根据courseName 去查询数据
      // alert('调用搜索方法后端。利用axios 请求数据，进行渲染', parameter)
      return await this.$request.get('api/auth/getAllCourse', {
        params: parameter
      }).then(res => {
        console.log('getData', res)
        return res
      })

    },
    search () {
      console.log('根据名字去模糊查询', this.formInline.courseName)
      let params = {
        start: 0,
        size: 10,
        name: this.formInline.courseName
      }
      this.getdata(params).then(res => {
        console.log('测试search', res)
        this.tableData = res.data.data.records
      })

      this.$request.get('api/auth/getCountCourseByName', { params: { name: this.formInline.courseName } }).then(res => {
        console.log(res.data.data)
        this.pageparm.total = res.data.data
      })

    },
    // 分页插件事件
    async callFather (parm) {

      alert('去后台查询数据\'')
      console.log('parm的值为', parm)
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize

      let params = {
        start: parm.currentPage,
        size: parm.pageSize
      }
      if (this.formInline.courseName != null) {
        params.name = this.formInline.courseName
      }
      //TODO去后端获取数据
      this.show = false
      await this.$request.get('api/auth/getAllCourse', { params: params }).then(res => {
        console.log(res)
        this.show = true
        this.tableData = res.data.data.records
      })

    },
    newCourse () {

      this.$router.push('/createCourse')
      alert('新建一个课程')

    },
    batchAddManager () {
      alert('批量添加管理员')
    },
    init () {
      console.log('this is work init')
      let data = this.getdata({
        start: 0,
        size: 10
      }).then(res => {
        this.tableData = res.data.data.records
      })

      this.$request.get('api/auth/getCountCourse').then(res => {
        console.log(res.data.data)
        this.coureTotal = res.data.data
        this.pageparm.total = this.coureTotal
      })
    }
  },
  created () {

    this.init()

  }
}
</script>

<style scoped>

.user-search {
  margin-top: 20px;
}

.userRole {
  width: 100%;
}

</style>
