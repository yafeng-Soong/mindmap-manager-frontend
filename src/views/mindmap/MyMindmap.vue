<template>
  <div class="fill-height ma-4">
    <mindmap-add-dialog 
      v-if="addDialog"
      :dialog="addDialog"
      :isAdd="isAdd"
      :themeInfo="themeInfo"
      @on-change-dialog="changeAddDialog">
    </mindmap-add-dialog>
    <v-card flat tile>
      <v-toolbar  dark color="primary">
        <v-toolbar-title style="font-size: x-large">我的脑图</v-toolbar-title>
        <div class="ma-4">总计{{pageInfo.total}}个</div>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="queryForm.name"
          hide-details
          single-line
          prepend-inner-icon="mdi-feature-search"
          placeholder="查找"
          style="width: 10px"
        ></v-text-field>
        <v-btn icon title="查找" @click="search"><v-icon>mdi-search-web</v-icon></v-btn>
        <v-btn icon title="新建" @click="addDialog = true"><v-icon>mdi-plus-circle</v-icon></v-btn>
      </v-toolbar>
      <v-container fluid class="grey lighten-4">
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="item in themeList" :key="item.id">
            <mindmap-card 
              :themeInfo="item"
              @changed="getPageList"
              @removed="themeFlash">
            </mindmap-card>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="grey lighten-4">
        <v-layout justify-center>
          <pagination
          :currentPage="pageInfo.currentPage"
          :total="pageInfo.pages" @on-change-page="changePage"></pagination>
        </v-layout>
      </v-card-actions>
    </v-card>
    <div class="ma-8"></div>
    <v-card flat tile>
      <v-toolbar  dark color="red lighten-2">
        <v-toolbar-title style="font-size: x-large">回收站</v-toolbar-title>
        <div class="ma-4">总计{{removedPageInfo.total}}个</div>
      </v-toolbar>
      <v-container fluid class="grey lighten-4">
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="item in removedList" :key="item.id">
            <removed-card
              :themeInfo="item"
              @recovered="themeFlash">
            </removed-card>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="grey lighten-4">
        <v-layout justify-center>
          <pagination theme="red lighten-2"
          :currentPage="removedPageInfo.currentPage"
          :total="removedPageInfo.pages" @on-change-page="changeRemovedPage"></pagination>
        </v-layout>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Pagination from '@/components/common/Pagination.vue'
import MindmapAddDialog from '@/components/mindmap/MindmapAddDialog.vue'
import MindmapCard from '@/components/mindmap/MindmapCard.vue'
import themeApi from '@/api/themeApi.js'
import RemovedCard from '../../components/mindmap/RemovedCard.vue'
export default {
  name: 'MyMindmap',
  components: {
    Pagination,
    MindmapAddDialog,
    MindmapCard,
    RemovedCard,
  },
  data(){
    return {
      addDialog: false,
      defaultPageInfo: {
        currentPage: 1,
        pageSize: 3,
        total: 0,
        pages: 1
      },
      pageInfo: {
        currentPage: 1,
        pageSize: 3,
        total: 0,
        pages: 1
      },
      removedPageInfo: {
        currentPage: 1,
        pageSize: 3,
        total: 0,
        pages: 1
      },
      themeInfo: null,
      isAdd: true,
      queryForm: {},
      themeList: [],
      removedList: []
    }
  },
  created() {
    this.getPageList()
    this.getRemovedPageList()
  },
  computed: {
  },
  methods:{
    getList() {
      let that = this
      themeApi.getList()
        .then(res => {
          console.log(res)
          if (res.code === 200)
            that.themeList = res.data;
          else {
            this.$toast.error(res.data)
            console.log('获取脑图列表失败'+res.data);
          }
        })
        .catch(err => {
          this.$toast.error('网络异常')
          console.log('网络错误！'+err);
        })
    },
    getPageList() {
      let that = this
      this.themeList = []
      this.queryForm.currentPage = this.pageInfo.currentPage
      this.queryForm.pageSize = this.pageInfo.pageSize
      themeApi.getPageList(this.queryForm)
        .then(res => {
          if (res.code === 200) {
            that.themeList = res.data.data;
            that.pageInfo.pages = res.data.pages
            that.pageInfo.total = res.data.total
          } else {
            this.$toast.error(res.data)
            console.log('获取脑图列表失败'+res.data);
          }
        })
        .catch(err => {
          this.$toast.error('网络异常')
          console.log('网络错误！'+err);
        })
    },
    getRemovedPageList() {
      let that = this
      this.removedList = []
      let param = {
        currentPage: this.removedPageInfo.currentPage,
        pageSize: this.removedPageInfo.pageSize,
        removed: true
      }
      themeApi.getPageList(param)
        .then(res => {
          if (res.code === 200) {
            that.removedList = res.data.data;
            that.removedPageInfo.pages = res.data.pages
            that.removedPageInfo.total = res.data.total
          } else {
            this.$toast.error(res.data)
            console.log('获取回收站列表失败'+res.data);
          }
        })
        .catch(err => {
          this.$toast.error('网络异常')
          console.log('网络错误！'+err);
        })
    },
    search() {
      this.pageInfo = Object.assign({}, this.defaultPageInfo)
      this.getPageList()
    },
    changeAddDialog(val) {
      this.addDialog = val
      this.getPageList()
    },
    changePage(val) {
      this.pageInfo.currentPage = val
      this.getPageList()
    },
    changeRemovedPage(val) {
      this.removedPageInfo.currentPage = val
      this.getRemovedPageList()
    },
    themeFlash() {
      this.getPageList()
      this.getRemovedPageList()
    },
  }
}
</script>

<style scoped>

</style>
