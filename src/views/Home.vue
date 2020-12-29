<!-- <template>
  <div class="fill-height">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script> -->
<template>
  <div class="fill-height">
    <navigation-drawer
      :drawer="drawer"
      @on-change-drawer="changeDrawer"
    >
    </navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>论文脑图工具</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-badge 
              color="red"
              overlap
              v-model="messageNum">
              <template v-slot:badge>{{messageNum}}</template>
                <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>查看消息</span>
      </v-tooltip>
    </v-app-bar>

    <!-- <v-content> -->
      <v-container
        class="fill-height"
        fluid
      >
        <v-layout justify-center>
          <v-flex xs12 sm12 md12>
            <router-view v-if="isRouterAlive"></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    <!-- </v-content> -->
    <!-- <v-footer
      color="primary"
      app
    >
      <span class="white--text">&copy; 2020</span>
    </v-footer> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import userApi from "@/api/userApi.js"
import NavigationDrawer from '@/components/home/NavigationDrawer.vue'

export default {
  name: 'home',
  components: {
    // HelloWorld
    NavigationDrawer
  },
  provide(){
    return {
      reload: this.reload
    }
  },
  data(){
    return {
      drawer: false,
      isRouterAlive: true,
      messageNum: 0,
      pageInfo: {
        pageNum: 1,
        pageSize: 15,
        sex: 1
      }
    }
  },
  // async created() {
  //   try {
  //     let res = await userApi.isLogin()
  //     if (res.code === 200)
  //       this.$store.commit('SET_CURRENT_USER', res.data)
  //     else
  //       this.$router.replace('/login');
  //   } catch (err) {
  //     this.$router.replace('/login');
  //   }
  // },
  methods:{
    reload(){
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    sayHello(){
      userApi.sayHello()
              .then(res => {
                this.$toast.info(res)
                let user = this.$store.getters.getCurrentUser
                console.log("当前登录用户~~~")
                console.log(user)
                console.log(user.email)
                console.log("~~~~~")
              })
              .catch(err => {
                console.log(err)
              })
    },
    logout(){
      userApi.logout()
              .then(res =>{
                this.$toast.info(res)
                this.$router.replace("/login")
              })
              .catch(err =>{
                console.log(err)
              })
    },
    selectPageList(){
      userApi.selectPageList(this.pageInfo)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    changeDrawer(val){
      this.drawer = val
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .container {
    padding: 0;
  }
</style>