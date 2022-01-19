<template>
  <div id="trash-detail">
    <h1>{{ msg }} : {{ $route.params.noteId }}</h1>
  </div>
</template>

<script>
import Auth from '../api/auth'

export default {
  name: 'TrashDetail',
  data() {
    return {
      msg: '回收站详情页'
    }
  },
  created() {
    Auth.getInfo()
      .then(res => {
        if (!res.isLogin) {
          this.$router.push({path: '/login'})
        }
      })
  }
}
</script>

<style scoped>
h1 {
  color: blue;
}
</style>
