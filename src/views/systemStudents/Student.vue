<template>
  <div>


    <!--  学员总览-->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">
        <el-button type="text">返回</el-button>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-button type="text" disabled>学员总览</el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>


    <el-row :gutter="20">
      <el-col :span="2">
        <div class="grid-content bg-purple">
          <span>学员总数</span>
          <span>40</span>

        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple">
          打卡总数
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple">
          作业总数
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple">
          解锁总数
        </div>
      </el-col>
    </el-row>


    <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">

      <el-menu-item index="1">学员总览</el-menu-item>
      <el-menu-item index="2">黑名单</el-menu-item>
      <el-menu-item index="3">访客</el-menu-item>

    </el-menu>
    <el-button type="primary" @click="exportExcel">导出excel</el-button>
    <el-table :data="tableData" size="small" stripe>
      <el-table-column prop="name, avatarUrl" label="学员" width="140">
        <template slot-scope="scope">
          <img class="img" :src="scope.row.avatarUrl">
          <span> {{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="学员id" width="140">
      </el-table-column>
      <el-table-column prop="note" label="备注" width="140">
      </el-table-column>
      <el-table-column prop="totalCourse" label="课程数" width="140">
      </el-table-column>
      <el-table-column prop="phone" label="手机" width="140">
      </el-table-column>
      <el-table-column prop="lastSubmitCourse" label="最近参与课程" width="140">
      </el-table-column>
      <el-table-column prop="lastSubmit" label="最后一次打卡" width="140">
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handShowInfo(scope.row)">查看概况</el-button>
          <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
export default {
  name: "Student",
  created() {
    this.getAllUser()
  },
  data() {
    return {
      tableData: [
        /* {
           studentName: 'sf',
           studentId: '2222',
           desc: "sfdsfdsfs"
         }*/


      ]
    }
  },
  methods: {

    handleSelect() {
      alert("去后台请求数据")
    },
    exportExcel() {
      //U引入easyexcel 进行数据的导出 后端完成
      alert("后端使用easyExcel 框架进行实现")
    },
    getAllUser() {
      this.$request.get("api/auth/getAllUser", {params: {start: 0, size: 10}}).then(res => {
        console.log("请求成功返回数据 ： {}", res.data)
        this.tableData = res.data.data.records
      })
    },
    handShowInfo(row) {
      console.log("this is row :{}", row)
      this.$router.push({
        path: "/showStudentInfo",
        query: {
          row
        }
      })
    },
    handleEdit() {
    }
  },
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;

}

:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  text-align: center;
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 50px;
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.img {

  height: 32px;
  width: auto;
  border-radius: 50%;
}
</style>
