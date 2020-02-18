// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueClipboard from 'vue-clipboard2'
import axios from 'axios'
import qs from 'qs'
import global from './global.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

Vue.prototype.$axios = axios
Vue.prototype.qs = qs
Vue.prototype.$global = global
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.use(VueAwesomeSwiper)


router.beforeEach((to, from, next) => {
  console.log('enter before');
  if(to.meta.auth){
    Vue.prototype.$axios({
      method: 'post',
      url: Vue.prototype.$global.base_url + 'checkUser',
      data: {
        token: localStorage.getItem('token')
      }
    }).then((res) => {
      if(res.data != 'fail'){
        console.log('enter');
        Vue.prototype.$global.user_state.name = localStorage.getItem('name');
        Vue.prototype.$global.user_state.isLogin = true;
        next();
      }else{
        next();
      }
    }).catch((err) => {
      console.log(err);
      next();
    });
  }else{
    next();
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
