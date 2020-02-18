<template>
  <div class="outer-login">
      <div class="header">
          <img src="../assets/myLogo.png" class="logo">
          <div>
              <span>TRASH</span>
          </div>
      </div>
      <div class="card">
          <el-card class="box-card">
              <div slot="header" class="card-header">
                  <span>Welcome Back</span>
              </div>
              <el-form ref="form" :rules="rules" :model="form" label-width="0px" class="form">
                  <el-form-item prop="name">
                      <el-input v-model="form.name" placeholder="请输入邮箱" prefix-icon="el-icon-message" size="large"></el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                      <el-input v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-edit" size="large"></el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="login" class="login-button"><span>Log In</span></el-button>
                  </el-form-item>
              </el-form>
              <div class="tag">
                  <el-tag type="danger" @click="home" class="tag-home">主页</el-tag>
                  <el-tag type="success" @click="register" class="tag-re">没有账号？点击注册</el-tag>
              </div>
          </el-card>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data () {
    return {
      msg: 'Welcome to Your test Vue.js App',
      form: {
          name: '',
          password: '',
      },
      rules: {
          name: [
              { required: true, message: '请输入正规邮箱地址', trigger: 'blur' },
          ],
          password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
          ]
      },
    }
  },
  methods: {
      //！！！回调！！！
      //当用户点击左下角主页按钮时回调此函数，跳转回主页
      home: function (){
          this.$router.push({
              path: '/home'
          });
      },
      //！！！回调！！！
      //当用户点击下方登录按钮时回调此函数，处理登录逻辑
      login: function (){
          const self = this
          //！！！Promise！！！
          //axios是基于Promise API封装的封装的网络请求函数，形式与Promise基本一致
          this.$axios({
              method: 'post',
              url: self.$global.base_url + 'loginByToken',
              data: {
                  name: this.form.name,
                  password: this.form.password
              }
          }).then((response) => {
              if(response.data.msg == 'success'){
                  console.log('login success');
                  this.$global.user_state.name = this.form.name;
                  this.$global.user_state.isLogin = true;
                  this.$router.push({
                      path: '/home'
                  });
                  this.$message({
                      message: '登录成功',
                      type: 'success'
                  });
                  localStorage.setItem('token', response.data.token);
                  localStorage.setItem('name', this.form.name);
                  console.log(response.data, response.data.token);
              }else if(response.data == 'fail'){
                  this.$message.error('用户名或密码错误');
              }else if(response.data == 'nothing'){
                  this.$message.error('未知错误');
              }else if(response.data == 'NotExist'){
                  this.$message.error('该用户不存在');
              }
              else{
                  this.$message.error('登陆失败，请检查网络连接');
              }
          }).catch((error) => {
              console.log(error);
          });
      },
      //！！！回调！！！
      //当用户点击右下角注册按钮时回调此函数，跳转到注册页面
      register: function (){
          this.$router.push({
              path: '/register'
          });
      },
      //！！！闭包！！！
      //由于vue存在全局CSS污染的情况，每次路由页面body样式会被上一个页面的CSS覆盖，故每次进入页面时需动态设置body样式
      //这里用闭包的方式来设置样式显得更直观，而且如果在后续的业务逻辑中还需要动态改变样式时，无需重复写修改的样式的css代码
      //仅需传入想改的相关参数调用该函数并执行即可，非常直观，后续代码可阅读、可解释、可维护性较好
      LoginBodyStyle: function (margin, padding, backImg, backSize, backRep, backAtt){
          return function (){
            document.body.style.margin = margin;
            document.body.style.padding = padding;
            document.body.style.backgroundImage = backImg;
            document.body.style.backgroundSize = backSize;
            document.body.style.backgroundRepeat = backRep;
            document.body.style.backgroundAttachment  = backAtt;
          };
      }
  },
  created: function (){
      console.log('created');
      var setBody = this.LoginBodyStyle('0px', '0px', 'url(' + require('../assets/login.png') + ')', "cover", "no-repeat", "fixed");
      setBody();
  },
  mounted: function (){
      console.log('mounted');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* 
body {
    margin: 0px;
    padding: 0px;
    background-image: url(../assets/login.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
} */

.outer-login {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.outer-login .header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 5%;
}

.outer-login .header span {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 30px;
    color: white;
    font-weight: bold;
    margin-bottom: 20px;
    /* background: linear-gradient(to right, white, grey); */
    /* color: transparent;
    -webkit-background-clip: text; */
}

.outer-login .logo {
    width: 70px;
    margin-right: 30px;
}

.outer-login .box-card {
    padding: 20px;
    width: 450px;
    height: 450px;
    position: absolute;
    left: 35.5%;
    bottom: 10%;
}

.outer-login .card-header {
    margin: 20px;
}

.outer-login .card-header span {
    font-size: 40px;
    font-weight: bold;
}

.outer-login .form {
    margin: 20px;
}

.outer-login .login-button {
    margin-top: 40px;
    width: 360px;
    height: 50px;
}

.outer-login .login-button span {
    font-size: 18px;
    font-weight: bold;
}

.outer-login .tag {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.outer-login .tag-re {
    margin-top: 10px;
    margin-left: 280px;
    cursor: pointer;
}

.outer-login .tag-home {
    margin-top: 10px;
    cursor: pointer;
}



</style>
