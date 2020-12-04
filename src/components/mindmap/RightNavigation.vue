<template>
  <v-navigation-drawer
    v-model="drawer_"
    absolute
    temporary
    right
    width="350px">
    <v-tabs 
      v-model="tab"
      centered 
      slider-size="1"
      icons-and-text>
      <v-tab>
        成员
        <v-icon>mdi-account-group</v-icon>
      </v-tab>
      <v-tab>
        操作记录
        <v-icon>mdi-history</v-icon>
      </v-tab>
      <v-tab>
        回收站
        <v-icon>mdi-delete-clock</v-icon>
      </v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-list three-line>
            <v-list-item>
              <v-list-item-avatar>
                    <v-img :src="creator.avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>{{userInfo.username}}    (创建者)</v-list-item-title>
                    <v-list-item-subtitle>{{userInfo.email}}</v-list-item-subtitle>
                </v-list-item-content>  
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item v-for="(item, index) in items"
                :key="index"
                >
                <v-list-item-avatar color="primary" size="30">
                    <!-- <v-img :src="item.avatar"></v-img> -->
                    <span class="white--text headline">{{item.title[0]}}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                    <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
        </v-list>
        <v-layout justify-center align-center>
          <v-btn text color="warning">邀请成员</v-btn>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <v-list three-line>
          <v-list-item v-for="(item, index) in operations" 
          :key="index">
            <v-list-item-avatar color="primary">
              <span class="white--text headline">{{item.operatorName[0]}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{item.operatorName + ' ' + item.operation}}
                <span class="text--secondary text-body-2">{{item.tagName}}</span>
              </v-list-item-title>
              <v-list-item-subtitle>{{item.createTime}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-col v-if="operations.length > 0">
          <v-divider></v-divider>
          <v-layout justify-center align-center>
          <v-btn text color="warning">查看更多</v-btn>
          </v-layout>
        </v-col>
      </v-tab-item>
      <v-tab-item>
        <v-list three-line>
          <v-list-item 
            v-for="(item, index) in removedList"
            :key="index">
            <v-list-item-avatar color="primary">
              <span class="white--text headline">宋</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{item.tagName}}
                <span class="text--secondary text-body-2">由{{item.operatorName}}删除</span>
              </v-list-item-title>
              <v-list-item-subtitle>{{item.createTime}}</v-list-item-subtitle>
            </v-list-item-content>
            <tip-icon
              small
              color="success"
              tip="还原"
              icon="mdi-restore"
              @click="recoverTag(item.tagId)">
            </tip-icon>
            <tip-icon
              small
              color="error"
              tip="彻底删除"
              icon="mdi-delete-forever">
            </tip-icon>
          </v-list-item>
        </v-list>
        <v-col v-if="removedList.length > 0">
          <v-divider></v-divider>
          <v-layout justify-center align-center>
          <v-btn text color="warning">查看更多</v-btn>
          </v-layout>
        </v-col>
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>

<script>
import tagApi from '@/api/tagApi.js'
import TipIcon from "../common/TipIcon";
export default {
  name: 'RightNavigation',
  components: {TipIcon},
  comments: {TipIcon},
  props: {
    drawer: {
      types: Boolean,
      default: false
    }
  },
  data() {
    return {
      test: 'JD',
      themeInfo: this.$store.getters.getThemeInfo,
      userInfo: this.$store.getters.getCurrentUser,
      tab: null,
      removedList: [],
      operations: [],
      creator: {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        title: '兰威',
        subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
      },
      items: [
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: '兰威',
          subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: '曹长巍',
          subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: '任建',
          subtitle: '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        },
      ],
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
    }
  },
  mounted() {
    this.getRemoveList()
    this.getRecentOperations()
  },
  methods: {
    getRemoveList() {
      let that = this
      tagApi.getRemoveList(this.themeInfo.id)
        .then(res => {
          if (res.code === 200)
            that.removedList = res.data
          else console.log("获取被删除列表失败")
        })
        .catch(err => {
          console.log(err)
        })
    },
    getRecentOperations() {
      let that = this
      tagApi.getRecentOperations(this.themeInfo.id)
        .then(res => {
          if (res.code === 200)
            that.operations = res.data.slice(0,5)
          else console.log("获取操作列表失败")
        })
        .catch(err => {
          console.log(err)
        })
    },
    async recoverTag(tagId) {
      try {
        let res= await tagApi.recoverTag(tagId)
        if (res.code === 200)
          this.$toast.success('还原成功')
        else
          this.$toast.error(res.msg)
      } catch (err) {
        this.$toast.error('网络异常')
        console.log(err)
      }
      this.drawer_ = false
      this.$emit('recover-tag')
    }
  }
}
</script>

<style>

</style>