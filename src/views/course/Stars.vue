<template>

  <div id="app" class="row">
    <div class="form-group clearfix">
      <img class="grade-box" v-for="(star,index) in stars" :src="star.src" alt="星星图片" @click="rating(index)"
           :key="index"/>
      <label class="control-label col-md-4">{{ starNum }}</label>
    </div>
  </div>
</template>

<script>
const starOffImg = 'starOff.png'
const starOnImg = 'starOn.png'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Stars',
  data () {
    return {
      stars: [{
        src: starOffImg,
        active: false
      }, {
        src: starOffImg,
        active: false
      }, {
        src: starOffImg,
        active: false
      }, {
        src: starOffImg,
        active: false
      }, {
        src: starOffImg,
        active: false
      }],
      starNum: 0
    }
  },

  methods: {
    showSrc (star) {
      console.log(star.src)
    },
    // 评分
    rating: function (index) {
      const total = this.stars.length // 星星总数
      const idx = index + 1 // 这代表选的第idx颗星-也代表应该显示的星星数量

      // 进入if说明页面为初始状态
      if (this.starNum === 0) {
        this.starNum = idx
        for (var i = 0; i < idx; i++) {
          this.stars[i].src = starOnImg
          this.stars[i].active = true
        }
      } else {
        // 如果再次点击当前选中的星级-仅取消掉当前星级，保留之前的。
        if (idx === this.starNum) {
          // eslint-disable-next-line no-redeclare
          for (var i = index; i < total; i++) {
            this.stars[i].src = starOffImg
            this.stars[i].active = false
          }
        }
        // 如果小于当前最高星级，则直接保留当前星级
        if (idx < this.starNum) {
          // eslint-disable-next-line no-redeclare
          for (var i = idx; i < this.starNum; i++) {
            this.stars[i].src = starOffImg
            this.stars[i].active = false
          }
        }
        // 如果大于当前星级，则直接选到该星级
        if (idx > this.starNum) {
          // eslint-disable-next-line no-redeclare
          for (var i = 0; i < idx; i++) {
            this.stars[i].src = starOnImg
            this.stars[i].active = true
          }
        }

        let count = 0 // 计数器-统计当前有几颗星
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < total; i++) {
          if (this.stars[i].active) {
            count++
          }
        }
        this.starNum = count
      }
    }
  }

}
</script>

<style scoped>

.clearfix {
  display: flex;
}

.grade-box {
  height: 20px;
  width: 20px;
}
</style>
