<template>

  <div class="hello" style="height:100%;width:100%;">
    <v-chart :options="option"></v-chart>
    <h1> {{message1}}</h1>
    <h1>{{ message }}</h1>
  </div>

</template>

<script>
import request from '@/utils/request'

export default {
  name: 'AddMenu',
  data () {
    return {
      option: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      },
      message: '',
      message1: ''
    }
  },
  methods: {
    async init () {
      await request.get('api/hello').then(res => {
        this.message = res.data
      })
    }
  },
  mounted () {
  },
  created () {
    console.log('addMenu中查看route.path', this.$route.path)

    console.log(this.$router.options.routes)
    // eslint-disable-next-line no-unused-expressions
    this.message1 ? this.message1 : this.message1 = 'test'
    this.init()
  }
}
</script>

<style scoped>

</style>
