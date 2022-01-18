<template>
  <div id="login">
    <div class="modal-mask">
      <div class="modal-container">
        <div class="main">
          <span>让记录更简单</span>
          <div class="back"></div>
        </div>
        <div class="form">
          <div v-show="isShowRegister" class="register">
            <h3>创建账户</h3>
            <input type="text" v-model="register.username" placeholder="请输入用户名">
            <input type="text" v-model="register.password" placeholder="请输入密码">
            <p :class="{error:register.isError}">{{ register.notice }}</p>
            <div class="button" @click="onRegister">创建账号</div>
            <p>已有帐户 <span @click="showLogin" class="jumpLogin">登录</span></p>
          </div>
          <div v-show="isShowLogin" class="login">
            <h3>登录</h3>
            <input type="text" v-model="login.username" placeholder="请输入用户名">
            <input type="text" v-model="login.password" placeholder="请输入密码">
            <p :class="{error:login.isError}">{{ login.notice }}</p>
            <div class="button" @click="onLogin">登录账号</div>
            <p>没有帐户 <span @click="showRegister" class="jumpRegister">注册</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "../helper/request";

request('/auth/login', 'POST', {username: 'hunger', password: 123456})
  .then(data => console.log(data))
export default {
  name: 'Login',
  data() {
    return {
      isShowLogin: false,
      isShowRegister: true,
      login: {
        username: '',
        password: '',
        notice: '请输入用户名和密码',
        isError: false
      },
      register: {
        username: '',
        password: '',
        notice: '请输入用户名和密码',
        isError: false
      }
    }
  },
  methods: {
    showLogin() {
      this.isShowRegister = false
      this.isShowLogin = true
    },
    showRegister() {
      this.isShowRegister = true
      this.isShowLogin = false
    },
    onRegister() {
      if (!/^[\w\u4e00-\u9fa5]{3,15}$/.test(this.register.username)) {
        this.register.isError = true
        this.register.notice = '用户名长度3~15个字符'
        return
      }
      if (!/^.{6,16}$/.test(this.register.password)) {
        this.register.isError = true
        this.register.notice = '密码长度为6~16个字符'
        return
      }
      this.register.isError = false
      this.register.notice = ''
      console.log(`start register..., username: ${this.register.username} , password: ${this.register.password}`)
    },
    onLogin() {
      if (!/^[\w\u4e00-\u9fa5]{3,15}$/.test(this.register.username)) {
        this.register.isError = true
        this.register.notice = '用户名长度3~15个字符'
        return
      }
      if (!/^.{6,16}$/.test(this.register.password)) {
        this.register.isError = true
        this.register.notice = '密码长度为6~16个字符'
        return
      }
      this.register.isError = false
      this.register.notice = ''
      console.log(`start register..., username: ${this.register.username} , password: ${this.register.password}`)
    }
  }
}
</script>

<style scoped lang="less">
.modal-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("../assets/background1.png") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  margin: 0 auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  transform: translateY(15px);
  display: flex;

  .main {
    text-align: center;

    .back {
      height: 410px;
      width: 410px;
      background: url("../assets/background2.png") center center no-repeat;
      background-size: contain;
    }

    span {
      display: inline-block;
      margin-top: 30px;
      font-size: 24px;
      color: skyblue;
    }
  }

  .form {
    margin: 0 15px;

    h3 {
      padding: 24px 0;
      font-size: 18px;
      border-top: 1px solid #eee;

      &:nth-of-type(2) {
        border-bottom: 1px solid #eee;
      }
    }

    .button {
      background-color: #2b8cf4;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-weight: bold;
      color: #fff;
      border-radius: 4px;
      margin-top: 18px;
      cursor: pointer;
    }

    .login, .register {
      padding: 20px 20px;
      border-top: 1px solid #eee;

      input {
        display: block;
        width: 100%;
        height: 35px;
        line-height: 35px;
        padding: 0 6px;
        border-radius: 4px;
        border: 1px solid #ccc;
        outline: none;
        font-size: 14px;
        margin-top: 10px;
      }

      input:focus {
        outline: 2px solid #9dcaf8;
      }

      p {
        font-size: 12px;
        margin-top: 10px;
        color: #444;
      }

      .error {
        color: red;
      }

      .jumpLogin, .jumpRegister {
        display: inline-block;
        cursor: pointer;

        &:hover {
          color: #0441f8;
        }
      }
    }

    .login {
      border-top: 0;
    }
  }
}
</style>
