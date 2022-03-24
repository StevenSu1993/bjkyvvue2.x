<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/student' }">
        <el-button type="text">返回</el-button>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-button type="text" disabled>查看概况</el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>

  </div>
</template>

<script>
export default {
  name: 'ShowStudentInfo',
  data () {
    return {
      allCourse: []
    }
  },
  created () {
    // 路由传递过来的参数
    console.log(this.$route.query.row)
    const currentUser = this.$route.query.row
    // 根据用户id 去查他所有的课程
    this.$request.get('api/auth/getCourseByUserId', {
      params: {
        userId: currentUser.id
      }
    }).then(res => {
      console.log('查询到改用户所有的课程 : {}', res.data)
      this.allCourse = res.data.data
    })
  }
}
</script>

<style scoped>

</style>
