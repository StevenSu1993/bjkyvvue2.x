<template>
  <div>
    <!--    <audio-->
    <!--        :src='voiceMsgUrl'-->
    <!--        controls-->
    <!--        controlsList='nodownload noremote footbar'-->
    <!--        :autoplay="false"/>-->
    <img :src="voiceMsgUrl"/>
  </div>
</template>

<script>
export default {
  name: 'testBlob',
  data () {
    return {
      voiceMsgUrl: ''
    }
  },
  mounted () {
    this.$request.get('api/auth/getBlobBytes', { responseType: 'blob' }).then(res => {
      console.log('testblob', res)
      var blob = new Blob([res.data], { type: 'image/png' })
      var url = window.URL.createObjectURL(blob)
      console.log(url)
      this.voiceMsgUrl = url
    })
  }
}
</script>

<style scoped>

</style>
