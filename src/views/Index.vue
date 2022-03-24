<template>

  <el-container class="index-con">
    <el-aside :class="showclass">
      <LeftNav></LeftNav>
    </el-aside>
    <el-container class="main-con">
      <el-header class="index-header">
        <NavCon></NavCon>
      </el-header>
      <el-main clss="index-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import LeftNav from '../components/Leftnav'
import NavCon from '../components/Navcon'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',

  components: { NavCon, LeftNav },
  data () {
    return {
      showclass: 'asideshow',
      showtype: false
    }
  },

  created () {
    // 监听
    this.$bus.$on('toggle', value => {
      if (value) {
        this.showclass = 'asideshow'
      } else {
        setTimeout(() => {
          this.showclass = 'aside'
        }, 300)
      }
    })
  }
}
</script>

<style scoped >
.index-con {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.aside {
  width: 64px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
}
.asideshow {
  width: 240px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
}
.index-header,
.index-main {
  padding: 0px;
  border-left: 2px solid #333;
}
</style>
