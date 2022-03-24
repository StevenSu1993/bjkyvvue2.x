<template>
  <!-- <div height="100%" id="editorBox" ref="editor"></div>-->
  <div>

    <el-tabs lazy='true' v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部素材" name="first">
        <AllMaterial></AllMaterial>
      </el-tab-pane>
<!--      <el-tab-pane label="图像" name="second">-->
<!--&lt;!&ndash;        <UpImg></UpImg>&ndash;&gt;-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="视频" name="third">-->
<!--        <UpVideo></UpVideo>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="文档" name="fourth">定时任务补偿</el-tab-pane>-->
    </el-tabs>

  </div>
</template>

<script>
import AllMaterial from '@/views/materialCenter/items/AllMaterial'

export default {
  name: 'ImageMaterial',
  components: {
    // UpVideo,
    // UpImg,
    AllMaterial
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick (tab, event) {
      // tab.$destroy()
      console.log(tab, event)
    }
  },
  mounted () {
  }

}
</script>

<style scoped>

</style>
