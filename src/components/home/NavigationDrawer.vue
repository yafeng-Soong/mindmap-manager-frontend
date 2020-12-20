<template>
  <v-navigation-drawer
    v-model="drawer_"
    app
    temporary>
    <template v-slot:prepend>
      <v-img :aspect-ratio="16/9" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img :src="headImgUrl">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{userInfo.username}}</v-list-item-title>
            <v-list-item-subtitle>{{userInfo.email}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-img>
    </template>
    <v-divider></v-divider>
    <v-list nav>
      <v-list-item-group color="primary">
        <v-list-item v-for="item in items" :key="item.title" :to="item.url">
          <v-list-item-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color="primary" @click="logout">退出登录</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import userApi from '@/api/userApi.js'
export default {
  name: 'NavigationDrawer',
  props: {
    drawer: {
      types: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: [
        {title: '我的脑图', icon: 'mdi-brain', url: '/myMindmap'},
        {title: '论文列表', icon: 'mdi-book-open', url: '/myPaper'},
        {title: '上传论文', icon: 'mdi-file-upload', url: '/submit'},
        {title: '个人信息', icon: 'mdi-contacts', url: '/modifyInfo'},
        // {title: '更多功能', icon: 'mdi-power', url: '/test'}
      ],
      userInfo: this.$store.getters.getCurrentUser
    }
  },
  methods: {
    logout(){
      userApi.logout()
        .then(res =>{
          if (res.code === 200)
            this.$toast.success(res.data)
          else
            this.$toast.error(res.data)
          this.$store.commit('SET_CURRENT_USER', null)
          this.$router.replace("/")
        })
        .catch(err =>{
          console.log(err)
        })
    }
  },
  computed: {
    drawer_: {
      get() {
        return this.drawer;
      },
      set(val) {
        //drawer_改变由父组件控制
        this.$emit("on-change-drawer", val);
      }
    },
    headImgUrl:  function() {
      return this.$store.getters.getBaseUrl+this.$store.getters.getCurrentUser.avatar
    },
  }
}
</script>