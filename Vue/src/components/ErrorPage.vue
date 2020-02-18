<template>
  <div class="outer">
      <div class="content">
          <transition name="el-zoom-in-center">
              <div class="img" v-show="show">
                  <img src="../assets/404.jpg">
              </div>
          </transition>
          <transition name="el-fade-in-linear">
              <div class="text" v-show="show">
                  <span>404 NOT FOUND</span>
              </div>
          </transition>
          <transition name="el-zoom-in-center">
              <div class="btn" v-show="show">
                  <button @click="backToHome()" id="home"><span>Home</span></button>
                  <button @click="backToPre()" id="pre"><span>Back</span></button>
              </div>
          </transition>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  components: {},
  data () {
    return {
      msg: 'Welcome to Your test Vue.js App',
      show: false
    }
  },
  methods: {
      //！！！回调！！！
      //当用户点击返回按钮时回调此函数，回到上一个页面
      backToPre: function (){
          this.$router.go(-1)
      },
      //！！！回调！！！
      //当用户点击返回主页按钮时回调此函数，返回主页
      backToHome: function (){
          this.$router.push({
              path: '/home'
          })
      }
  },
  created: function (){
      console.log('created')
  },
  mounted: function (){
      console.log('mounted')
      this.show = true
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

body {
    margin: 0px;
    padding: 0px;
    background-color: rgb(246, 246, 246)
}

.outer {
  /* background-size: 100%;
  height: 100%;
  width: 100%;
  position: fixed; */
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.content {
    margin-top: 0px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.text {
    margin-top: 50px;
}

.text span {
    font-size: 50px;
}

button {
    cursor: pointer;
    border: 1px solid #22a7f0;
    background: 0 0;
    border-radius: 3.5px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 1rem;
    padding: 6px 24px;
    text-decoration: none;
    outline: 0;
}



.btn {
    margin-top: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.btn span {
    color: #22a7f0;
}

#home {
    margin-right: 20px;
}

#pre {
    margin-left: 20px;
}


</style>
