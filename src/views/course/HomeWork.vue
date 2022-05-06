<template>
  <div>
    <div class="homeDetail">
      <div class="head">
        <div class="homeWorkTitle">
          <span style="color:#354369 ;font-family:Helvetica Neue;font-size: 15px">作业列表</span>
          <el-button type="text"> 编辑</el-button>
        </div>
        <span style="font-size: 12px">学员端只显示已开始作业，排序将同步到学员作业列表</span>
        <div class="creatHomeWork">
          <el-button type="primary" @click="newHomeWork">
            <span class="iconfont icon-tianjia"></span>
            创建作业
          </el-button>
        </div>
      </div>
    </div>

    <div class="drawLine" @click="clickHomeWorkItem">
      <div class="homeWorkItem" ref="item">
        <div class="homeWokrName">{{ }} 作业名字001</div>
        <div class="homeWorkStatus">
          <span>作业起止时间</span>
          <span>状态</span>
        </div>
      </div>
    </div>

    <div class="drawLine" @click="clickHomeWorkItem">
      <div class="homeWorkItem" ref="item">
        <div class="homeWokrName">{{}} 作业名字002</div>
        <div class="homeWorkStatus">
          <span>作业起止时间</span>
          <span>状态</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'HomeWork',
  props: ['params'],
  data () {
    return {}
  },
  methods: {
    newHomeWork () {
      this.$router.push({
        name: 'createHomeWork',
        params: {
          params: this.params
        }
      })
    },
    clickHomeWorkItem (event) {
      console.log(this.$refs.item)
      this.$refs.item.forEach(i => {
        i.classList.remove('skate')
      })
      event.target.classList.add('skate')
    }
  },
  mounted () {
    // 去后端获取数据
    console.log('父组件传递过来的', this.params)
  }
}
</script>

<style scoped>

.homeDetail {
  background-color: #ffffff;
  border-color: #f5f5f5;
  border-style: solid none solid solid;
  border-width: 1.11111px 0px 1.11111px 2.98611px;
  color: #354369;
  padding: 12px 20px;
}

.homeWorkTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /*text-align: center;*/
}

.creatHomeWork {
  padding: 14px 0px 0px;
  display: flex;
  justify-content: center;
  align-items: Center;
}

.iconfont {
  font-size: 14px;
}

.homeWorkItem {
  background-color: #f8f9fa;
  color: #354369;
  font-size: 14px;
  padding: 8px 16px;
}

/*.homeWorkItem::before {*/
/*  content: '';*/
/*  position: absolute; !*定位背景横线的位置*!*/
/*  top: 0;*/
/*  left: 0;*/
/*  background: #6497fd;*/
/*  width: 5px; !*宽和高做出来的背景横线*!*/
/*  height: 100%;*/
/*  !*display: none;*!*/
/*  !*display: inline-block;*!*/
/*}*/

.skate::before {
  content: '';
  position: absolute; /*定位背景横线的位置*/
  top: 0;
  left: 0;
  background: #6497fd;
  width: 5px; /*宽和高做出来的背景横线*/
  height: 100%;
  /*display: none;*/
  /*display: inline-block;*/
}

.drawLine {
  position: relative;
}

.homeWokrName {
  color: #3d7dfd;
  display: inline;
  font-size: 18px;
}

.homeWorkStatus {
  margin-top: 5px;
  color: #c4c8cc;
  font-size: 12px;
  display: flex;
  justify-content: space-between;

}
</style>
