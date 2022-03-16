<template>

  <div class="hello" style="height:100%;width:100%;">
    <v-chart :options="option" ></v-chart>
  </div>

</template>

<script>
export default {
  name: "AddMenu",
  data() {
    return {
      option :{
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
      }

    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
