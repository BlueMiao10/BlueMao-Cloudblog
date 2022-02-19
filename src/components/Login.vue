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
            <input type="password" v-model="register.password" placeholder="请输入密码">
            <p :class="{error:register.isError}">{{ register.notice }}</p>
            <div class="secret">
              <el-checkbox label="已阅读并同意服务协议和隐私条款" name="type" v-model="typeR"></el-checkbox>
              <div class="button" @click="onRegister">创建并登录账号</div>
            </div>
            <p class="jumpLogin">
              <span>已有帐户</span>
              <el-link @click="showLogin" type="success">登录</el-link>
            </p>
          </div>
          <div v-show="isShowLogin" class="login">
            <h3>登录账户</h3>
            <input type="text" v-model="login.username" placeholder="请输入用户名">
            <input type="password" v-model="login.password" placeholder="请输入密码">
            <p :class="{error:login.isError}">{{ login.notice }}</p>
            <div class="secret">
              <el-checkbox label="已阅读并同意服务协议和隐私条款" name="type" v-model="typeL"></el-checkbox>
              <div class="button" @click="onLogin">登录账号</div>
            </div>
            <p class="jumpRegister">
              <span>没有帐户</span>
              <el-link @click="showRegister" type="success">注册</el-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '../helper/bus'
import {mapActions} from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      typeR: false,
      typeL: false,
      isShowLogin: true,
      isShowRegister: false,
      login: {
        username: '',
        password: '',
        notice: '',
        isError: false
      },
      register: {
        username: '',
        password: '',
        notice: '',
        isError: false
      }
    }
  },
  methods: {
    ...mapActions({
      loginUser: 'login',
      registerUser: 'register'
    }),
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
      this.registerUser({username: this.register.username, password: this.register.password})
        .then(() => {
          if (this.typeR) {
            this.register.isError = false
            this.register.notice = ''
            this.$message({
              message: '注册成功',
              type: 'success'
            });
            this.$router.push({path: 'notebooks'})
          } else {
            this.register.notice = '未同意隐私条款'
          }
        }).catch(data => {
        this.register.isError = true
        this.register.notice = data.msg
      })
    },
    onLogin() {
      if (!/^[\w\u4e00-\u9fa5]{3,15}$/.test(this.login.username)) {
        this.login.isError = true
        this.login.notice = '用户名长度3~15个字符'
        return
      }
      if (!/^.{6,16}$/.test(this.login.password)) {
        this.login.isError = true
        this.login.notice = '密码长度为6~16个字符'
        return
      }
      this.loginUser({username: this.login.username, password: this.login.password})
        .then(() => {
          if (this.typeL) {
            this.login.isError = false
            this.login.notice = ''
            Bus.$emit('userInfo', {username: this.login.username})
            this.$router.push({path: 'notebooks'})
          } else {
            this.login.isError = true
            this.login.notice = '未同意隐私条款'
          }
        }).catch(data => {
        this.login.isError = true
        this.login.notice = data.msg
      })
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
  background: url("https://s3.bmp.ovh/imgs/2022/02/ea143c3bc26b7a3c.png") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  min-width: 480px;
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
      background: url("https://s3.bmp.ovh/imgs/2022/02/29e495160f18b6b4.png") center center no-repeat;
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
      text-align: center;
    }

    .secret {
      margin-top: 30px;

      .button {
        background-color: #2b8cf4;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-weight: bold;
        color: #fff;
        border-radius: 4px;
        margin-top: 10px;
        cursor: pointer;
      }
    }

    .login, .register {
      padding: 20px 20px;

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
        height: 16px;
      }

      .error {
        color: red;
      }

      .jumpLogin, .jumpRegister {
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          display: inline-block;
          padding-right: 10px;
        }
      }
    }

    .login {
      border-top: 0;
    }
  }
}
</style>
