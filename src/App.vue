<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  // mounted(){
  //   if (!accessToken) {
  //     this.$message.danger('请先登录');
  //     this.$router.push('/')
  //   }
  // }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
