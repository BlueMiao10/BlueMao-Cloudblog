<template>
  <ol id="slide-bar">
    <li>
      <avatar/>
    </li>
    <li class="icons">
      <router-link to="/note" title="笔记"><i class="iconfont icon-note"></i></router-link>
      <router-link to="/notebooks" title="笔记本"><i class="iconfont icon-notebook"></i></router-link>
      <router-link to="/trash"><i class="iconfont icon-trash"></i></router-link>
    </li>
    <li class="logout">
      <i class="iconfont icon-logout" @click="logout"></i>
    </li>
  </ol>
</template>

<script>
import Avatar from "./Avatar";
import Auth from "../api/auth";

export default {
  components: {Avatar},
  methods: {
    logout() {
      Auth.logout()
        .then(() => {
          this.$message.success('注销成功')
          this.$router.push({path: '/login'})
        })
    }
  }
}
</script>

<style scoped lang="less">
#slide-bar {
  position: relative;
  width: 56px;
  text-align: center;
  background-color: #2c333c;

  .icons {
    margin-top: 15px;

    a {
      padding: 6px 0;
      display: block;
    }

    .router-link-active {
      background-color: #5e6266;
    }
  }

  .logout {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    cursor: pointer;
  }

  .iconfont {
    color: #fff;
  }
}
</style>
