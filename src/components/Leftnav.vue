<template>

  <div>
    <el-menu  :collapse="collapsed" collapse-transition router :default-active="$route.path"
             unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff"
             active-text-color="#ffd04b">
      <div class="logobox">
        <img class="logoimg" src="../assets/img/logo.png" alt="">
      </div>
      <el-submenu class="item" v-for="menu in allmenu" :key="menu.id" :index="menu.name">
        <template slot="title">
          <i class="iconfont" :class="menu.icon"></i>
          <span>{{ menu.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="chmenu in menu.childMenu" :index="chmenu.url"  :key="chmenu.id">
            <i class="iconfont" :class="chmenu.icon"></i>
            <span>{{ chmenu.name }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>

  </div>

</template>

<script>

export default {
  name: 'LeftNav',
  data () {
    return {
      collapsed: false,
      allmenu: []
    }
  },
  methods: {

  },
  created: function () {
    // this.allmenu = res;
    // 首先判断用户是否登录
    this.allmenu = this.$store.state.allMenu

    /* console.log("在vuex中获取到的数据",this.allmenu)
    console.log("vuex中的数据",this.$store.state.allMenu) */

    /*   if (localStorage.getItem('jwt')) {
      this.$request.get("api/auth/getMenu").then(res => {
        this.allmenu = res.data.data
        //把菜单放到store中去，为了动态生成路由
        this.$store.dispatch('setRouteByMenu', this.allmenu)

        console.log(this.$router.options.routes)
      })
    } else {
      this.$message({
        message: '请登录后再来',
        type: 'warning'
      });
    } */
    // root 访问得到的是根父组件
    this.$bus.$on('toggle', value => {
      this.collapsed = !value
    })
  }
}
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}

.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.item{
  text-align: left;
}

.logoimg {
  height: 40px;
}
</style>
