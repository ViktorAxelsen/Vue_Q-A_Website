<template>
  <div class="outer-register">
      <div class="header">
          <img src="../assets/myLogo.png" class="logo">
          <div>
              <span>TRASH</span>
          </div>
      </div>
      <div class="card">
          <el-card class="box-card">
              <div slot="header" class="card-header">
                  <span>Start Your Journey</span>
              </div>
              <el-form ref="form" :rules="rules" :model="form" label-width="0px" class="form">
                  <el-form-item prop="name">
                      <el-input v-model="form.name" placeholder="请输入邮箱" prefix-icon="el-icon-message" size="large"></el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                      <el-input v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-edit" size="large"></el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="success" @click="register" class="register-button"><span>Confirm</span></el-button>
                  </el-form-item>
              </el-form>
              <div class="tag">
                  <el-tag type="danger" @click="home" class="tag-home">主页</el-tag>
                  <el-tag @click="login" class="tag-lo">已有账号？点击登录</el-tag>
              </div>
          </el-card>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
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
      //当用户点击左下方主页按钮时回调此函数，跳转回主页
      home: function (){
          this.$router.push({
              path: '/home'
          });
      },
      //！！！回调！！！
      //当用户点击右下方登录按钮时回调此函数，跳转到登录界面
      login: function (){
          this.$router.push({
              path: '/login'
          })
      },
      //！！！回调！！！
      //当用户点击注册按钮时回调此函数，处理注册逻辑
      register: function (){
          const self = this
          //！！！Promise！！！
          //axios是基于Promise API封装的网络请求函数，形式与Promise基本一致
          //这里主页处理注册逻辑，将用户输入的信息post到后端
          this.$axios({
              method: 'post',
              url: self.$global.base_url + 'register',
              data: {
                  name: this.form.name,
                  password: this.form.password
              }
          }).then((response) => {
              if(response.data == 'success'){
                  console.log('register success');
                  this.$router.push({
                      path: '/login'
                  });
                  this.$message({
                      message: '注册成功',
                      type: 'success'
                  });
              }else{
                  this.$message.error('注册失败，账号已存在');
              }
          }).catch((error) => {
              console.log(error);
          });
      },
      //！！！闭包！！！
      //由于vue存在全局CSS污染的情况，每次路由页面body样式会被上一个页面的CSS覆盖，故每次进入页面时需动态设置body样式
      //这里用闭包的方式来设置样式显得更直观，而且如果在后续的业务逻辑中还需要动态改变样式时，无需重复写修改的样式的css代码
      //仅需传入想改的相关参数调用该函数并执行即可，非常直观，后续代码可阅读、可解释、可维护性较好
      RegisterBodyStyle: function (margin, padding, backImg, backSize, backRep, backAtt){
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
      var setBody = this.RegisterBodyStyle('0px', '0px', 'url(' + require('../assets/register.png') + ')', "cover", "no-repeat", "fixed");
      setBody();
  },
  mounted: function (){
      console.log('mounted');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

/* body {
    margin: 0px;
    padding: 0px;
    background-image: url(../assets/register.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
} */

.outer-register {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.outer-register .header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 5%;
}

.outer-register .header span {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 30px;
    color: white;
    font-weight: bold;
    margin-bottom: 20px;
    /* background: linear-gradient(to right, white, grey); */
    /* color: transparent;
    -webkit-background-clip: text; */
}

.outer-register .logo {
    width: 70px;
    margin-right: 30px;
}

.outer-register .box-card {
    padding: 20px;
    width: 450px;
    height: 450px;
    position: absolute;
    left: 35.5%;
    bottom: 10%;
}

.outer-register .card-header {
    margin: 20px;
}

.outer-register .card-header span {
    font-size: 40px;
    font-weight: bold;
}

.outer-register .form {
    margin: 20px;
}

.outer-register .register-button {
    margin-top: 40px;
    width: 360px;
    height: 50px;
}

.outer-register .register-button span {
    font-size: 18px;
    font-weight: bold;
}

.outer-register .tag {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.outer-register .tag-lo {
    margin-top: 10px;
    margin-left: 280px;
    cursor: pointer;
}

.outer-register .tag-home {
    margin-top: 10px;
    cursor: pointer;
}
</style>
