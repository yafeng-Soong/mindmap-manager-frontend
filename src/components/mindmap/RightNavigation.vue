<template>
  <div>
    <v-dialog
      v-model="dialog"
      width="500">
      <v-card>
        <v-toolbar dark color="red lighten-2">
          <v-card-title>
            确定要彻底删除？
          </v-card-title>
          <v-divider></v-divider>
          <tip-icon
           tip="关闭"
           icon="mdi-close"
           @click="dialog = false">
          </tip-icon>
        </v-toolbar>
        <v-card-text class="display-1 text--primary">
          彻底删除后无法找回，并且与节点相关的论文数据也会被删除，请谨慎操作
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <progress-button
            :text="true"
            progressColor="error"
            color="error"
            title="删除"
            :disabled="loading"
            :loading="loading"
            @click="deleteTag">
          </progress-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      v-model="inviteDialog"
      width="500">
      <v-card>
        <v-toolbar dark color="orange lighten-1">
          <v-card-title>
            请输入成员的邮箱
          </v-card-title>
          <v-spacer></v-spacer>
          <tip-icon
           tip="关闭"
           icon="mdi-close"
           @click="inviteDialog = false">
          </tip-icon>
        </v-toolbar>
        <v-card-text>
          <v-text-field class="ma-4"
            v-model="email"
            label="成员邮箱" 
            name="email"
            prepend-icon="mdi-email"
            required
            hint="请输入要邀请的邮箱"
            type="text"
            :rules="emailRules"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <progress-button
            :text="true"
            progressColor="orange lighten-1"
            color="orange lighten-1"
            title="邀请"
            :disabled="!inviteDisable"
            :loading="loading"
            @click="inviteMember">
          </progress-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      v-model="kickDialog"
      width="500">
      <v-card>
        <v-toolbar dark color="red lighten-2">
          <v-card-title>
            确定要踢出该成员？
          </v-card-title>
          <v-divider></v-divider>
          <tip-icon
           tip="关闭"
           icon="mdi-close"
           @click="kickDialog = false">
          </tip-icon>
        </v-toolbar>
        <v-card-text class="display-1 text--primary">
          该成员创建的结点及操作将得到保留，可以重新邀请该成员
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <progress-button
            :text="true"
            progressColor="error"
            color="error"
            title="踢出"
            :disabled="loading"
            :loading="loading"
            @click="kickOut">
          </progress-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                      <v-img :src="headImgUrl(creator.avatar)"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                      <v-list-item-title>{{creator.username}}    (创建者)</v-list-item-title>
                      <v-list-item-subtitle>{{creator.email}}</v-list-item-subtitle>
                  </v-list-item-content>  
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item v-for="(item, index) in members"
                  :key="index"
                  >
                  <v-list-item-avatar size="30">
                      <v-img :src="headImgUrl(item.avatar)"></v-img>
                      <!-- <span class="white--text headline">{{members.avatar}}</span> -->
                  </v-list-item-avatar>
                  <v-list-item-content>
                      <v-list-item-title v-html="item.username"></v-list-item-title>
                      <v-list-item-subtitle v-html="item.email"></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action v-if="kickAble">
                    <tip-icon
                      color="error"
                      tip="踢出"
                      icon="mdi-account-remove"
                      @click="showKick(item.id)">
                    </tip-icon>
                  </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
          </v-list>
          <v-layout justify-center align-center>
            <v-btn text color="warning" @click="inviteDialog = true">邀请成员</v-btn>
          </v-layout>
        </v-tab-item>
        <v-tab-item>
          <v-list three-line>
            <v-list-item v-for="(item, index) in operations" 
            :key="index">
              <v-list-item-avatar>
                <v-img :src="headImgUrl(item.avatar)"></v-img>
                <!-- <span class="white--text headline">{{item.operatorName[0]}}</span> -->
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
              <!-- <v-btn text color="warning">查看更多</v-btn> -->
              <pagination class="ma-2"
                :currentPage="operationPage.currentPage"
                :total="operationPage.pages" @on-change-page="changeOperationPage">
              </pagination>
            </v-layout>
          </v-col>
        </v-tab-item>
        <v-tab-item>
          <v-list three-line>
            <v-list-item 
              v-for="(item, index) in removedList"
              :key="index">
              <v-list-item-avatar>
                <v-img :src="headImgUrl(item.avatar)"></v-img>
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
                icon="mdi-delete-forever"
                @click="deleteDialog(item.tagId)">
              </tip-icon>
            </v-list-item>
          </v-list>
          <v-col v-if="removedList.length > 0">
            <v-divider></v-divider>
            <v-layout justify-center align-center>
            <!-- <v-btn text color="warning">查看更多</v-btn> -->
              <pagination class="ma-2"
                :currentPage="removedPage.currentPage"
                :total="removedPage.pages" @on-change-page="changeRemovedPage">
              </pagination>
            </v-layout>
          </v-col>
        </v-tab-item>
      </v-tabs-items>
    </v-navigation-drawer>
  </div>
</template>

<script>
import tagApi from '@/api/tagApi.js'
import themeApi from '@/api/themeApi.js'
import TipIcon from "../common/TipIcon"
import Pagination from '@/components/common/Pagination.vue'
import ProgressButton from '../../components/common/ProgressButton.vue'
export default {
  name: 'RightNavigation',
  components: {
    TipIcon,
    Pagination,
    ProgressButton,
  },
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
      dialog: false,
      inviteDialog: false,
      kickDialog: false,
      kcikUserId: null,
      deleteTagId: null,
      removedList: [],
      operations: [],
      loading: false,
      email: null,
      emailRules: [
        v => !!v || '必须输入邮箱字段',
        v => /^\w+([.-]?\w+)*@\w+([.-]\w+)*(\.\w{2,3})+$/.test(v) || '请输入正确格式的邮箱'
      ],
      operationPage: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
        pages: 1
      },
      removedPage: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
        pages: 1
      },
      creator: null,
      members: [],
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
    headImgUrl() {
      return (path) => this.$store.getters.getBaseUrl + path
    },
    inviteDisable() {
      let email = /^\w+([.-]?\w+)*@\w+([.-]\w+)*(\.\w{2,3})+$/.test(this.email)
      return email && !this.loading
    },
    kickAble() {
      return this.creator.id === this.$store.getters.getCurrentUser.id
    }
  },
  watch: {
    // 监视drawer，如果打开就加载相应列表
    drawer(val) {
      if (val) {
        this.getRemoveList()
        this.getRecentOperations()
        this.getMembers()
      }
    }
  },
  // mounted() {
  //   this.getRemoveList()
  //   this.getRecentOperations()
  //   this.getMembers()
  // },
  methods: {
    getRemoveList() {
      let that = this
      this.removedList = []
      let param = {
        currentPage: this.removedPage.currentPage,
        pageSize: this.removedPage.pageSize,
        themeId: this.themeInfo.id
      }
      themeApi.getRemoveList(param)
        .then(res => {
          if (res.code === 200) {
            that.removedList = res.data.data
            that.removedPage.pages = res.data.pages
            that.removedPage.total = res.data.total
          } else console.log("获取被删除列表失败")
        })
        .catch(err => {
          console.log(err)
        })
    },
    getRecentOperations() {
      let that = this
      this.operations = []
      let param = {
        currentPage: this.operationPage.currentPage,
        pageSize: this.operationPage.pageSize,
        themeId: this.themeInfo.id
      }
      themeApi.getRecentOperations(param)
        .then(res => {
          if (res.code === 200) {
            that.operations = res.data.data
            that.operationPage.pages = res.data.pages
            that.operationPage.total = res.data.total
          } else console.log("获取操作列表失败")
        })
        .catch(err => {
          console.log(err)
        })
    },
    async getMembers() {
      try {
        let themeId = this.themeInfo.id
        let res = await themeApi.getMembers(themeId)
        if (res.code === 200) {
          this.creator = res.data.creator
          this.members = res.data.members
        } else console.log('获取脑图成员失败：' + res.data)
      } catch (err) {
        console.log(err)
      }
    },
    deleteDialog(tagId) {
      this.deleteTagId = tagId
      this.dialog = true
    },
    showKick(userId) {
      this.kcikUserId = userId
      this.kickDialog = true
    },
    async inviteMember() {
      this.loading = true
      let param = {
        themeId: this.themeInfo.id,
        email: this.email
      }
      try {
        let res = await themeApi.inviteMember(param)
        if (res.code === 200) {
          this.$toast.success(res.data)
          this.inviteDialog = false
        } else this.$toast.error(res.data)
      } catch (err) {
        console.log(err)
        this.$toast.error('网络异常~')
      }
      this.loading = false
    },
    async kickOut() {
      this.loading = true
      let param = {
        themeId: this.themeInfo.id,
        userId: this.kcikUserId
      }
      try {
        let res = await themeApi.kickOff(param)
        if (res.code === 200)
          this.$toast.success(res.data)
        else this.$toast.error(res.data)
      } catch (err) {
        console.log(err)
      }
      this.loading = false
      this.kickDialog = false
    },
    async recoverTag(tagId) {
      try {
        let res= await tagApi.recoverTag(tagId)
        if (res.code === 200)
          this.$toast.success('还原成功')
        else
          this.$toast.error(res.data)
      } catch (err) {
        this.$toast.error('网络异常')
        console.log(err)
      }
      this.drawer_ = false
      this.$emit('recover-tag')
    },
    async deleteTag() {
      this.loading = true
      try {
        let res = await tagApi.deleteTag(this.deleteTagId)
        if (res.code === 200) {
          this.$toast.success(res.data)
          this.getRemoveList()
          this.getRecentOperations()
        }
        else
          this.$toast.error(res.data)
      } catch (err) {
        this.$toast.error('网络异常')
        console.log(err)
      }
      this.loading = false
      this.dialog = false
    },
    changeOperationPage(val) {
      this.operationPage.currentPage = val
      this.getRecentOperations()
    },
    changeRemovedPage(val) {
      this.removedPage.currentPage = val
      this.getRemoveList()
    }
  }
}
</script>

<style lang = "scss" scoped>
  .list-content{
    height: 90%;
  }
</style>