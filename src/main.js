import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/resetPassword')
    next()
  else {
    // if (store.getters.getCurrentUser == null) {
    //   next('/login')
    // } else next()
    if (store.getters.getToken == null) {
      next('/login')
    } else next()
  }
  if(to.meta.title){
    document.title = to.meta.title;
  }
})
Vue.use(ElementUI)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
