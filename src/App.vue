<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>
<style>
html,
body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
