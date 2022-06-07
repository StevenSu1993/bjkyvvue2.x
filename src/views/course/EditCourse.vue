<template>
  <div class="workContent">
    <div class="homeworkDetail">

      <div style="background-color:#f6f6f6;">
        <el-link class="menuName" :underline="false" style="margin-left: 20px;margin-top: 10px; color:#2f3a58">作业课程
        </el-link>
        <el-link class="workName" type="info" :underline="false" style="margin-left: 10px;margin-top: 10px;">
          /
        </el-link>
        <el-link class="workName" type="info" :underline="false" style="margin-left: 10px;margin-top: 10px;">
          {{ $route.params.row.name }}
        </el-link>
      </div>

      <div style="background: #eff1f7; padding:20px">
        <div class="workFeature">
          <span class="featureItem">
            <i class="iconfont icon-guanliyuanpeizhi"></i>
            <span class="back">管理员配置</span>
          </span>

          <span class="featureItem">
            <i class="iconfont icon-kemushezhi"></i>
            <span class="back">课程设置</span>
          </span>

          <span class="featureItem">
            <i class="iconfont icon-kechengjieshao1"></i>
            <span class="back">课程介绍</span>
          </span>

          <span class="featureItem">
            <i class="iconfont icon-fuzhikecheng"></i>
            <span class="back">复制课程</span>
          </span>

          <span class="featureItem">
            <i class="iconSize iconfont icon-daochuneirong"></i>
            <span class="back">导出内容</span>
          </span>

          <span class="featureItem">
            <i class="iconfont icon-kechengshuju"></i>
            <span class="back">课程数据</span>
          </span>

          <span class="featureItem">
            <i class="iconfont icon-yulan"></i>
            <span class="back">课程总览</span>
          </span>

          <span class="featureItem">
            <i class="iconfont icon-xueyuanguanli1"></i>
            <span class="back">学员管理</span>
          </span>

          <span class="featureItem">
            <i class="iconfont icon-paihangbang"></i>
            <span class="back">排行榜</span>
          </span>

          <span class="featureItem">
            <i class="iconfont icon-tuiguang"></i>
            <span class="back">课程推广</span>
          </span>
        </div>
      </div>

      <div>
        <el-tabs lazy='true' v-model="activeName">
          <el-tab-pane label="主题详情" name="first">
            <HomeWorkDetail></HomeWorkDetail>
          </el-tab-pane>

          <el-tab-pane label="批量点评" name="second">
            <h1>aaaaa</h1>
          </el-tab-pane>

          <el-tab-pane label="快捷点评" name="three">
            <h1>bbbbbb</h1>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="hiddenHomeWorkListTitle" v-show="closeTitleList" @click="hiddenHomeWorkList">
      <span class="iconfont icon-qianjin1">&nbsp;作业列表</span>
    </div>

    <div class="openHomeWorkListTitle" v-show="openTitleList" @click="showHomeWorkList">
      <span class="iconfont icon-houtui">&nbsp;作业列表</span>
    </div>

    <div class="templateList" v-show="isShowHomeList">
      <HomeWorkList :params=$route.params :homeWorkList="homeWorkList"></HomeWorkList>
    </div>
  </div>
</template>

<script>
import HomeWorkDetail from '@/views/course/HomeWorkDetail'
import HomeWorkList from '@/views/course/HomeWorkList'
import { getHomeListByCourseId } from '@/api/homeWorkFunc'
import Vue from 'vue'

export default {
  name: 'EditCourse',
  components: {
    HomeWorkList,
    HomeWorkDetail
  },
  data () {
    return {
      activeName: 'first',
      isShowHomeList: true,
      closeTitleList: true,
      openTitleList: false,
      homeWorkList: []
    }
  },
  mounted () {
    // 回填数据
    // console.log('开始回显数据', this.$route.params)
    getHomeListByCourseId().then(res => {
      this.homeWorkList = res
      // 页面初始化的时候就显示作业列表的第一条数据内容
      for (let i = 0; i < this.homeWorkList.length; i++) {
        if (i === 0) {
          Vue.set(this.homeWorkList[i], 'isShowLine', true)
          console.log('当前触发时间的i', i)
          this.$bus.$emit('showHomeWorkContent', this.homeWorkList[i])
        } else {
          Vue.set(this.homeWorkList[i], 'isShowLine', false)
        }
      }
    })
  },
  methods: {
    handleSelect (index, indexPath) {
      console.log(index, indexPath)
    },
    hiddenHomeWorkList () {
      this.isShowHomeList = false
      this.closeTitleList = false
      this.openTitleList = true
    },
    showHomeWorkList () {
      this.isShowHomeList = true
      this.closeTitleList = true
      this.openTitleList = false
    }
  }
}
</script>

<style scoped>
.menuName {
  color: #2f3a58;
  display: inline;
  font-family: Helvetica Neue;
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
}

.workName {
  color: #aeb6c4;
  display: inline;
  font-size: 14px;
  line-height: 14px;
}

.workContent {
  display: flex;
  /*position: relative;*/
}

.homeworkDetail {
  min-width: 80%;
  background-color: #eff1f7
}

.templateList {
  min-width: 20%;
}

.workFeature {
  background-color: #ffffff;

  border-radius: 4px;

  color: #354369;

  font-size: 14px;

}

.featureItem {
  display: inline-block;
  width: 125px;
  text-align: left;
  margin: 15px 40px 20px 20px;
}

.back {
  font-size: 14px;
  margin-left: 10px;
}

.iconfont {
  font-size: 14px;
}

.icon-qianjin1, .icon-houtui {

  color: #3d7dfd;
  writing-mode: vertical-rl;
  margin: 0 1px 2px;

}

.hiddenHomeWorkListTitle {
  position: absolute;
  top: 100px;
  right: 285px;
  cursor: pointer;

}

.openHomeWorkListTitle {
  position: absolute;
  top: 100px;
  right: 20px;
  cursor: pointer;
}

</style>
