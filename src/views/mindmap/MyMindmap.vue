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
              @detail-click="detail"
              @edit-click="edit">
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
  </div>
</template>

<script>
import Pagination from '@/components/common/Pagination.vue'
import MindmapAddDialog from '@/components/mindmap/MindmapAddDialog.vue'
import MindmapCard from '@/components/mindmap/MindmapCard.vue'
import themeApi from '@/api/themeApi.js'
export default {
  name: 'MyMindmap',
  components: {
    Pagination,
    MindmapAddDialog,
    MindmapCard,
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
      themeInfo: null,
      isAdd: true,
      queryForm: {},
      themeList: []
    }
  },
  created() {
    this.getPageList()
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
            this.$toast.error(res.msg)
            console.log('获取脑图列表失败'+res.msg);
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
            this.$toast.error(res.msg)
            console.log('获取脑图列表失败'+res.msg);
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
    detail(param) {
      this.$store.commit('setThemeInfo', param)
      // console.log(this.$store.getters.getThemeInfo)
      this.$router.push('/mindmapInfo')
      // this.$router.push('/helloWorld')
    },
    edit(param) {
      this.themeInfo = param
      this.addDialog = true
      this.isAdd = false
    },
    changeAddDialog(val) {
      this.addDialog = val
      this.isAdd = true
      this.getPageList()
    },
    changePage(val){
      this.pageInfo.currentPage = val;
      this.getPageList();
    },
  }
}
</script>

<style scoped>

</style>
