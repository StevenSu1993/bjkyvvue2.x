<template>

  <div>
    <div class="head">
      <div>
        <el-button>作业主题的名字</el-button>
        <el-button>修改主题</el-button>
      </div>
      <div>
        <el-button>分享课程</el-button>
        <el-button>复制主题到其他课程</el-button>
        <el-button>发送通知</el-button>
      </div>
    </div>

    <div :class="workContent">

      <div style="height: 300px;background: coral">

      </div>
      <div class="openDetail" v-show="showButton">
        <el-button type="primary" @click="changCssStyle"> 展开主题</el-button>
      </div>
    </div>

    <div class="footer">
      <div>
        <el-input v-model="inputName" placeholder="搜索学员和备注" size="mini"
                  style="width:160px;;margin-left: 30px"></el-input>
        <el-button plain size="mini" icon="el-icon-search" @click="searchByLike">搜索</el-button>

        <span style="margin-left: 20px">已提交0人</span>
        <el-button style="margin-left: 20px" type="text">参与概况</el-button>
      </div>

      <div>
        <el-cascader
            v-model="value"
            :options="options"
            size="mini"
            @change="handleChange"></el-cascader>

        <el-select ref="elSelect" placeholder="默认排序" v-model="orderValue" size="mini"
                   style="width: 100px;margin-left: 30px">
          <el-option value="0" label="默认排序"></el-option>
          <el-option value="1" label="点赞排序"></el-option>
          <el-option value="2" label="时间排序"></el-option>
          <el-option value="3" label="评分排序"></el-option>
          <el-option value="4" label="未评分排序"></el-option>
        </el-select>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  name: 'HomeWorkDetail',
  data () {
    return {
      showButton: true,
      workContent: 'workContent',
      inputName: '',
      orderValue: '0',
      value: [],
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }]
      }]
    }
  },
  methods: {
    changCssStyle () {
      this.workContent = 'workContentOrigin'
      this.showButton = false
    },
    searchByLike () {
    },
    handleChange () {
    }
  }

}
</script>

<style scoped>

.head {
  margin: auto;
  display: flex;
  justify-content: space-between;
}

.workContent {
  background: pink;
  border: 1px solid #e4e8f0;
  margin: 0 25px 15px;
  overflow-y: hidden;
  height: 200px;
  min-height: 200px;
  position: relative;
}

.workContentOrigin {
  background: pink;
  border: 1px solid #e4e8f0;
  margin: 0 25px 15px;
  min-height: 200px;
  position: relative;
}

.openDetail {
  width: 56px;
  height: 14px;
  background: lightgreen;
  position: absolute;
  top: 136px;
  margin: auto;
  left: 0;
  right: 0;
}

.footer {
  display: flex;
  justify-content: space-between;
}
</style>
