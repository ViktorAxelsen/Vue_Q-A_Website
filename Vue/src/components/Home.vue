<template>
  <div class="outer-home">
    <el-container>
      <transition name="el-fade-in-linear">
      <el-header class="header" v-show="header_show">
        <el-row>
          <el-col :span="2">
            <div>
              <img src="../assets/myLogo.png" class="myLogo">
            </div>
          </el-col>
          <el-col :span="this.$global.user_state.isLogin ? 19 : 18">
            <div>
              <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">答题中心</el-menu-item>
                <el-menu-item index="2">排行榜</el-menu-item>
                <el-submenu index="3">
                  <template slot="title">帮助中心</template>
                  <el-menu-item index="3-1">帮助文档</el-menu-item>
                  <el-menu-item index="3-2">关于</el-menu-item>
                </el-submenu>
              </el-menu>
            </div>
          </el-col>
          <el-col :span="this.$global.user_state.isLogin ? 3 : 4">
            <div class="button"  v-show="!this.$global.user_state.isLogin">
              <el-button-group>
                <el-button type="primary" @click="login">Login</el-button>
                <el-button type="success" @click="register">Register</el-button>
                <el-button type="danger" @click="share" v-clipboard:copy="address" v-clipboard:success="onCopy" v-clipboard:error="onCopyError">Share</el-button>
              </el-button-group>

              <el-dialog title="分享" :visible.sync="dialog_show" width="30%">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="pageImage">
                  <div style="padding: 14px;">
                    <span style="text-align: center;">{{address}}</span>
                    <div>
                      <!-- <time>{{currentDate}}</time> -->
                      <el-button type="text" @click="save">保存图片</el-button>
                      <el-button type="text" @click="saveCanvas">保存页面快照</el-button>
                    </div>
                  </div>
                </el-card>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialog_show = false">确定</el-button>
                </span>
              </el-dialog>
            </div>
            <div class="user" v-show="this.$global.user_state.isLogin">
              <span class="name">{{this.$global.user_state.name}}</span>
              <el-button type="danger" @click="quit">Quit</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      </transition>
      <transition name="el-zoom-in-top">
      <el-main v-show="main_show">
        <div class="start" v-show="activeIndex == 1">
          <div v-show="!questioning">
            <el-carousel :interval="1000" type="card" height="300px">
              <el-carousel-item v-for="item in banner" :key="item.key">
                <img :src="item.src">
              </el-carousel-item>
            </el-carousel>
            <el-tooltip class="item" effect="dark" content="最好先登录哦" placement="right">
              <el-button id="start" type="warning" @click="start" v-show="show" plain>开始答题</el-button>
            </el-tooltip>
            <div class="questionNum">
              <el-tooltip class="item" effect="dark" content="请选择题数，介于1~10之间" placement="right">
                <el-input-number v-model="numOfQuestion" :min="1" :max="10"></el-input-number>
              </el-tooltip>
            </div>
          </div>
          <div v-show="questioning">
            <div class="swiper swiper-no-swiping">
              <swiper :options="swiperOption" ref="questionSwiper">
                <swiper-slide v-for="q in question" :key="q.id">
                  <img :src="q.url" class="help-logo">
                  <div class="select-button">
                    <el-radio-group v-model="radio">
                      <el-radio :label="1" border id="btn-1" v-bind:class="{right: btnClass[0][0], wrong: btnClass[0][1]}">可回收物</el-radio>
                      <el-radio :label="2" border id="btn-2" v-bind:class="{right: btnClass[1][0], wrong: btnClass[1][1]}">有害垃圾</el-radio>
                      <el-radio :label="3" border id="btn-3" v-bind:class="{right: btnClass[2][0], wrong: btnClass[2][1]}">干垃圾</el-radio>
                      <el-radio :label="4" border id="btn-4" v-bind:class="{right: btnClass[3][0], wrong: btnClass[3][1]}">湿垃圾</el-radio>
                    </el-radio-group>
                  </div>
                  <div>
                    <el-button type="success" plain round @click="confirmSelect" :disabled="isConfirm">确定</el-button>
                  </div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
                <div class="swiper-button-prev swiper-slide" slot="button-prev"></div>
                <div class="swiper-button-next swiper-slide" slot="button-next"></div>
              </swiper>
            </div>
          </div>
        </div>
        <div class="rank" v-show="activeIndex == 2">
          <div class="rank_list">
            <el-table :data="tableData" :row-class-name="row" border style="width: 100%" :default-sort="{prop: 'score', order: 'descending'}" max-height="600">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="date" label="Date" sortable width="250"></el-table-column>
              <el-table-column prop="_id" label="User_ID" width="250"></el-table-column>
              <el-table-column prop="name" label="Name" width="180"></el-table-column>
              <el-table-column prop="score" label="Score" sortable></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="help-doc" v-show="activeIndex == '3-1'">
          <h1>1. 如何注册？</h1>
          <p>点击页面右上角绿色注册按钮即可跳转注册页面</p>
          <h1>2. 如何登录？</h1>
          <p>点击页面右上角蓝色注册按钮即可跳转注册页面</p>
          <h1>3. 如何开始答题？</h1>
          <p>点击页面左上角答题中心返回主页开始答题</p>
          <h1>4. 如何查看我的积分排名？</h1>
          <p>点击页面左上角排行榜即可查看</p>
        </div>
        <div class="help-about" v-show="activeIndex == '3-2'">
          <div class="image-logo">
            <img src="../assets/logo.png">
            <img class="help-logo" src="../assets/myLogo.png">
          </div>
          <div class="about">
            <h3>本项目前端基于 Vue.js + WebPack + ElementUI 开发</h3>
            <h3>后端基于 Node.js + Express + Mongodb 开发</h3>
          </div>
          <h1>打个分吧~</h1>
          <el-rate v-model="rate" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :disabled="hasRate">
          </el-rate>
          <el-button type="primary" class="confirm-rate" plain :disabled="rate == 0 || hasRate" @click="confirmRate">确认评分</el-button>
        </div>
      </el-main>
      </transition>
      <el-footer class="foot">
        <transition name="el-zoom-in-center">
          <div v-show="footer_show">
            <span>Powered by VitorAxelsen</span>
          </div>
        </transition>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { resolve, reject } from 'q';
export default {
  name: 'Home',
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        direction: 'horizontal',
        grabCursor: false,
        allowSlidePrev: false,
        observer: true,
        observeParents: true,
        on: {
          //！！！回调！！！
          //Swiper回调函数，当答题页面滑动时，回调此函数
          slideChange: () => {
            let swiper = this.$refs.questionSwiper.swiper;
            this.currentSwiperIndex = swiper.activeIndex;
            this.radio = 0;
            this.isConfirm = false;
            this.btnClass = [
              [false, false],
              [false, false],
              [false, false],
              [false, false]
            ];
            // document.getElementById('btn-1').classList.remove("wrong", "right");
            // document.getElementById('btn-2').classList.remove("wrong", "right");
            // document.getElementById('btn-3').classList.remove("wrong", "right");
            // document.getElementById('btn-4').classList.remove("wrong", "right");
            // console.log(document.getElementById('btn-4').classList)
            // console.log(document.getElementById('btn-3').classList)
            // console.log(document.getElementById('btn-2').classList)
            // console.log(document.getElementById('btn-1').classList)
            console.log(this.currentSwiperIndex);
          }
        },
      },
      tableData: [],
      banner: [
        {key: 0, src: require('../assets/logo.png')},
        {key: 1, src: require('../assets/logo.png')},
        {key: 2, src: require('../assets/logo.png')},
        {key: 3, src: require('../assets/logo.png')},
        {key: 4, src: require('../assets/logo.png')},
        {key: 5, src: require('../assets/logo.png')}
      ],
      question: [{
        url: '',
        answer: ''
      }],
      answerMap: ['可回收垃圾', '有害垃圾', '干垃圾', '湿垃圾'],
      btnClass: [
        [false, false],
        [false, false],
        [false, false],
        [false, false]
      ],
      currentDate: new Date(),
      address: 'http://192.168.43.17:8080/home',
      msg: 'Welcome to Your test Vue.js App',
      pageImage: require('../assets/logo.png'),
      activeIndex: '1',
      header_show: false,
      main_show: false,
      footer_show: false,
      show: true,
      dialog_show: false,
      rate: null,
      hasRate: false,
      questioning: false,
      numOfQuestion: 1,
      radio: 0,
      currentScore: 0,
      currentSwiperIndex: 0,
      isConfirm: false,
    }
  },
  created: function (){
    var setBody = this.homeBodyStyle('0px', '0px', '');
    setBody();
    console.log(this.$global.user_state.name, this.$global.user_state.isLogin);
  },
  mounted: function (){
    this.header_show = true;
    this.main_show = true;
    setTimeout(() => {
      this.footer_show = true;
    }, 1000);
  },
  methods: {
      //！！！闭包！！！
      //由于vue存在全局CSS污染的情况，每次路由页面body样式会被上一个页面的CSS覆盖，故每次进入页面时需动态设置body样式
      //这里用闭包的方式来设置样式显得更直观，而且如果在后续的业务逻辑中还需要动态改变样式时，无需重复写修改的样式的css代码
      //仅需传入想改的相关参数调用该函数并执行即可，非常直观，后续代码可阅读、可解释、可维护性较好
      homeBodyStyle: function (margin, padding, backImg){
        return function (){
          document.body.style.margin = margin;
          document.body.style.padding = padding;
          document.body.style.backgroundImage = backImg;
        };
      },
      //！！！回调！！！
      //当用户点击关于页面的确定评价按钮时，回调此函数
      confirmRate: function (){
        console.log(this.rate);
        this.hasRate = true;
        this.$message({
          message: '感谢您的评价',
          type: 'success'
        });
      },
      //！！！回调！！！
      //当用户在主页点击上方tab选项卡时，回调此函数，并传入tab的位置index，用于判断显示哪个div
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
      this.activeIndex = key;
      if(key == 2){
        this.updateRank();
      }
      if(key == 3){
        this.activeIndex = keyPath[1];
      }
    },
    updateRank: function (){
      this.request('rank');
    },
    //！！！回调！！！
    //用户点击login按钮回调此函数，跳转到登录页面
    login: function (){
      this.$router.push({
        path: '/login'
      });
    },
    //！！！回调！！！
    //用户点击register按钮回调此函数，跳转到注册页面
    register: function (){
      this.$router.push({
        path: '/register'
      });
    },
    //！！！回调！！！
    //当用户点击share按钮回调此函数，弹出对话框
    share: function (){
      this.dialog_show = true;
    },
    //！！！回调！！！
    //当用户点击quit按钮回调此函数，将本地存储token与name清空（本项目有做基于jwt的登录保持）
    quit: function (){
      localStorage.setItem('token', 'none');
      localStorage.setItem('name', 'none');
      this.$router.go(0);
    },
    //！！！回调！！！
    //！！！本项目核心逻辑---答题时确认选择按钮，点击回调此函数！！！
    //主要处理三个大逻辑：
    //1.用户未选择时点击了按钮
    //2.用户回答正确
    //3.用户回答错误
    confirmSelect: function (){
      if(this.radio == 0){
        this.$message({
          message: '请选择',
          type: 'warning'
        });
      }else{
        if(this.radio == this.question[this.currentSwiperIndex].answer){
          this.isConfirm = true;
          this.currentScore += 5;
          this.$message({
            message: '恭喜你，回答正确',
            type: 'success'
          });
          this.$notify({
            title: '积分+5',
            message: '本轮已累积积分：' + this.currentScore,
            offset: 100,
            type: 'success'
          });
          if(this.currentSwiperIndex + 1 != this.question.length){
            this.$refs.questionSwiper.swiper.slideTo(this.currentSwiperIndex + 1, 500, true);
          }else{
            setTimeout(function (){
              this.$alert('本轮您共获得' + this.currentScore + '积分', '答题结束', {
                confirmButtonText: '确定',
                callback: action => {
                  if(this.$global.user_state.isLogin){
                    this.updateScore(this.$global.user_state.name, this.currentScore);
                  }else{
                    this.$router.go(0);
                  }
                }
              });
            }.bind(this), 1000);
          }
        }else{
          this.isConfirm = true;
          var right_ans = this.question[this.currentSwiperIndex].answer;
          this.$message({
            message: '回答错误，正确答案是：' + this.answerMap[right_ans - 1],
            type: 'error'
          });
          var temp = this.radio;
          this.radio = 0;
          this.btnClass[right_ans - 1][0] = true;
          this.btnClass[temp - 1][1] = true;
          console.log('length: ' + this.question.length)
          if(this.currentSwiperIndex + 1 != this.question.length){
            // this.$refs.questionSwiper.swiper.slideTo(this.currentSwiperIndex + 1, 500, true);
          }else{
            setTimeout(function (){
              this.$alert('本轮您共获得' + this.currentScore + '积分', '答题结束', {
                confirmButtonText: '确定',
                callback: action => {
                  if(this.$global.user_state.isLogin){
                    this.updateScore(this.$global.user_state.name, this.currentScore);
                  }else{
                    this.$router.go(0);
                  }
                }
              });
            }.bind(this), 1000);
          }
        }
      }
    },
    updateScore: function (name, delta){
      //！！！Promise！！！
      //axios是基于Promise API的网络请求函数，与ajax差不多，形式完全就是Promise函数的形式
      //这里处理更新用户积分信息，先向后端发请求，等收到回复后（异步）再提示用户积分更新是否成功
      const self = this
      this.$axios({
        method: 'post',
        url: self.$global.base_url + 'updateScore',
        data: {
          name: name,
          delta: delta
        }
      }).then((response) => {
        if(response.data == 'fail'){
          this.$message.error('更新积分信息失败');
        }else if(response.data == 'success'){
          this.$message({
            message: '更新积分信息成功',
            type: 'success'
          });
          setTimeout(function (){
            this.$router.go(0);
          }.bind(this), 1000);
        }
      }).catch((err) => {
        console.log(err);
        this.$router.go(0);
      });
    },
    //！！！回调！！！
    //用户在点击share弹出的dialog中点击保存图片按钮回调此函数
    save: function (){
      this.dialog_show = false;
      this.download(this.pageImage, 'logo');
    },
    //！！！回调！！！
    //同上，点击保存快照回调此函数
    saveCanvas: function (){
      this.dialog_show = false;
      html2canvas(document.getElementsByClassName('outer-home')[0], {
        backgroundColor: null,
      }).then(canvas => {
        this.download(canvas.toDataURL("image/png"), 'pageCanvas')
      });
    },
    download: function (url, name){
      var link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onCopy: function (e) {
      this.$message({
        message: '网址已复制到剪切板',
        type: 'success'
      });
    },
    onCopyError: function(e) {
      this.$message.error('复制失败');
    },
    //！！！回调！！！
    //当排行榜页面更新时会回调此函数，并传入行与行号信息
    row: function ({row, rowIndex}){
      if(rowIndex === 0){
        return 'first-place';
      }else if(rowIndex === 1){
        return 'second-place';
      }else if(rowIndex === 2){
        return 'third-place';
      }
    },
    //！！！回调！！！
    //用户点击主页 开始答题 按钮回调此函数
    start: function (){
      if(this.$global.user_state.isLogin){
        this.request('question');
      }else{
        this.$confirm('未登录状态下答题积分不计入排行榜，确定开始答题吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.request('question');
        }).catch(() => {
          const self = this
          //！！！Promise！！！
          //这里使用Promise主要是为了保证先让第一条消息弹出来然后再让第二条消息弹出
          //如果两条记录弹出不用Promise作明显异步处理的话，会造成页面重叠的问题
          new Promise(function (resolve, reject){
            self.$notify({
              title: '注意',
              message: '可点击上方按钮登录/注册',
              type: 'success',
              offset: 100
            });
            resolve();
          }).then(function (result){
            self.$notify.info({
              title: '分享',
              message: '记得分享本网站给你的好友哦',
              offset: 100
            });
          }).catch((err) => {
            console.log(err);
          });
        })
      }
    },
    request: function (which){
      const self = this
      const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
      this.$message({
        type: 'success',
        message: '正在载入...'
      });
      this.$notify.info({
        title: '分享',
        message: '记得分享本网站给你的好友哦',
        offset: 100
      });
      if(which == 'question'){
        //！！！Promise！！！
        //axios是基于Promise API封装的网络请求函数，形式与Promise基本一致
        //这里主要处理题库拉取与排行信息拉取
        this.$axios({
          method: 'get',
          url: self.$global.base_url + 'question/' + this.numOfQuestion,
        }).then((response) => {
          console.log(response.data);
          setTimeout(function (){
            this.question = response.data
            loading.close();
            this.$message({
              message: '拉取题库成功',
              type: 'success'
            });
            this.questioning = true;
          }.bind(this), 1000);
        }).catch((err) => {
          console.log(err);
        });
      }else if(which == 'rank'){
        this.$axios({
          method: 'get',
          url: self.$global.base_url + 'rank'
        }).then((response) => {
          console.log(typeof response.data, response.data);
          setTimeout(function (){
            this.tableData = response.data;
            loading.close();
            this.$message({
              message: '拉取排行信息成功',
              type: 'success'
            });
          }.bind(this), 1000);
        }).catch((err) => {
          console.log(err);
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

/* body {
    margin: 0px;
    padding: 0px;
} */

.outer-home .start {
  margin-top: 0%;

}

.outer-home .questionNum {
  margin-top: 2%;
}

.outer-home .start #start {
  margin-top: 5%;
}

.outer-home .myLogo {
  width: 50px;
  margin-right: 20px;
  margin-top: 10px;
}

.outer-home .button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-left: 0px;
}

.outer-home .user {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
}

.outer-home .name {
  background: linear-gradient(to right, blue, red);
  color: transparent;
  -webkit-background-clip: text;
}

.outer-home .rank_list {
  margin-right: 120px;
  margin-left: 120px;
}


.outer-home {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  padding: 0px;
}

.outer-home .foot {
  position: fixed;
  bottom: 0%;
  left: 43%;
}

.outer-home .foot span {
  background: linear-gradient(to right, red, blue);
  color: transparent;
  -webkit-background-clip: text;
}

.outer-home .item {
  margin: 4px;
}

.outer-home .swiper-slide {
  margin-top: 7%;
  outline: none;
}

.outer-home .help-doc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.outer-home .image-logo {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.outer-home .help-about {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.outer-home .help-logo {
  width: 200px;
}

.outer-home .about {
  margin-top: 5%;
  margin-bottom: 3%;
}

.outer-home .confirm-rate {
  margin-top: 2%;
}

.outer-home .select-button {
  margin-top: 5%;
  margin-bottom: 5%;
}

.outer-home .right {
  border-color: rgb(103, 194, 58);
  border-width: 2px;
  color: rgb(103, 194, 58);
}

.outer-home .wrong {
  border-color: rgb(245, 108, 108);
  border-width: 2px;
  color: rgb(245, 108, 108);
}

.outer-home .el-table .first-place {
  background: rgb(253, 245, 230);
}

.outer-home .el-table .second-place {
  background: rgb(240, 249, 235);
}

.outer-home .el-table .third-place {
  background: rgb(236, 245, 255)
}

.outer-home .el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.outer-home .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
.outer-home .el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.outer-home .el-zoom-in-top-enter-active {
  transition: all 1s ease;
}

.outer-home .el-zoom-in-top-leave-active {
  transition: all 1s;
}

.outer-home .el-zoom-in-center-enter-active {
  transition: all 1s ease;
}

.outer-home .el-zoom-in-center-leave-active {
  transition: all 1s;
}

.outer-home .el-fade-in-linear-enter-active {
  transition: all 1s ease;
}

.outer-home .el-fade-in-linear-leave-active {
  transition: all 1s;
}


/* .header {
  margin: 0px;
  padding: 0px;
} */

</style>
