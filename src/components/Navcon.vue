<template>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
    <el-menu-item>
      <el-button class="buttonimg">
        <img class="showimg" :src="collapsed?imgsq:imgshow" @click="toggle(collapsed)">
      </el-button>
    </el-menu-item>
    <el-submenu class="submenuItem" style="float:right;" index="4">
      <!-- <template slot="title">{{user.userRealName}}</template> -->
      <template slot="title">超级管理员</template>
      <el-menu-item index="4-1">设置</el-menu-item>
      <el-menu-item @click="content()" index="4-2">个人中心</el-menu-item>
      <el-menu-item @click="exit()" index="4-3">退出</el-menu-item>
    </el-submenu>
    <el-menu-item class="submenuItem" style="float:right;" index="1">处理中心</el-menu-item>
    <el-menu-item class="submenuItem" style="float:right;" index="2">消息</el-menu-item>
    <el-menu-item class="submenuItem" style="float:right;" index="3">操作日志</el-menu-item>

  </el-menu>


</template>

<script>
export default {
  name: 'Navcon',
  data () {
    return {
      collapsed: true,
      imgshow: require('../assets/img/show.png'),
      imgsq: require('../assets/img/sq.png'),
    }
  },
  methods: {
    // 切换显示
    toggle (showtype) {
      this.collapsed = !showtype
      // this.$root.Bus.$emit('toggle', this.collapsed)
      this.$bus.$emit('toggle', this.collapsed)
    },
    // 退出登录
    exit () {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(() => {
            setTimeout(() => {
              this.$store.commit('logout', false)
              this.$router.push('/login').catch(() => {
              })
              this.$message({
                type: 'success',
                message: '已退出登录!'
              })
            }, 1000)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
    },

  }
}
</script>
<style scoped>
.buttonimg {
  height: 50px;
  background-color: transparent;
  border: none;
}

.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
</style>
