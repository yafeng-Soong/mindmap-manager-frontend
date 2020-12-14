<template>
  <div class="fill-height ma-4">
    <!-- <v-flex xs11 sm11 md11>  -->
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title style="font-size: x-large">我上传的文章</v-toolbar-title>
          <v-spacer></v-spacer>
          <div>总计{{pageInfo.total}}篇</div>
          <template #extension>
            <v-layout justify-center align-center>
              <v-flex class="ma-1">
                <v-text-field
                  v-model="queryForm.name"
                  hide-details
                  prepend-inner-icon="mdi-feature-search"
                  placeholder="标题"
                ></v-text-field>
              </v-flex>
              <v-flex class="ma-1">
                <v-text-field
                  v-model="queryForm.author"
                  hide-details
                  single-line
                  prepend-inner-icon="mdi-account-search"
                  placeholder="作者"
                ></v-text-field>
              </v-flex>
              <v-flex class="ma-1">
                <v-text-field
                  v-model="queryForm.keyword"
                  hide-details
                  single-line
                  prepend-inner-icon="mdi-comment-search"
                  placeholder="关键字"
                ></v-text-field>
              </v-flex>
              <v-flex class="ma-1">
                <v-text-field
                  v-model="queryForm.publishYear"
                  :rules="rules.publishYear"
                  hide-details
                  single-line
                  prepend-inner-icon="mdi-calendar-search"
                  placeholder="发表年份"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn icon title="新增" @click="addPaper"><v-icon>mdi-plus-circle</v-icon></v-btn>
            <v-btn class="ma-2" color="warning"  @click="resetSearch">重置</v-btn>
            <v-btn class="ma-2" color="success" :disabled="!searchDisabled" @click="search">查询</v-btn>
          </template>
        </v-toolbar>
        <el-table
          :data="paperList"
          align-center justify-center>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="论文标题">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="author"
            label="作者">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="keyword"
            label="关键字">
          </el-table-column>
          <el-table-column
            prop="publishYear"
            label="发表年份"
            width="100">
          </el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <v-btn @click="paperDetail(scope.row)" text icon color="primary" title="论文详情">
                <v-icon>mdi-text-subject</v-icon>
              </v-btn>
            </template>
          </el-table-column>
        </el-table>
        <v-card-actions>
          <v-layout align-center justify-center>
            <pagination
              :currentPage="pageInfo.currentPage"
              :total="pageInfo.pages" @on-change-page="changePage"></pagination>
          </v-layout>
        </v-card-actions>
      </v-card>
    <!-- </v-flex> -->
  </div>
</template>

<script>
import paperApi from '@/api/paperApi.js'
import Pagination from '@/components/common/Pagination.vue'
export default {
  name: 'MyPaper',
  components: {Pagination},
  data() {
    return {
      paperList: [],
      defaultPageInfo: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
        pages: 1
      },
      pageInfo: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
        pages: 1
      },
      queryForm: {},
      rules: {
        publishYear: [
          v => v.length == 0 || /^[1-9]\d{3}$/.test(v) || '日期格式不正确'
        ]
      }
    }
  },
  created() {
    this.getPaperList()
  },
  computed: {
    searchDisabled: function() {
      let year = this.queryForm.publishYear
      return !year || year.length == 0 || /^[1-9]\d{3}$/.test(year)
    }
  },
  methods: {
    getPaperList() {
      let that = this;
      this.paperList = []
      this.queryForm.currentPage = this.pageInfo.currentPage
      this.queryForm.pageSize = this.pageInfo.pageSize
      console.log(JSON.stringify(this.queryForm))
      paperApi.getPageList(this.queryForm)
        .then(res => {
          if (res.code === 200) {
            that.paperList = res.data.data
            that.pageInfo.pages = res.data.pages
            that.pageInfo.total = res.data.total
          } else {
            console.log('获取论文列表失败！' + res.data)
            this.$toast.error(res.data)
          }
        })
        .catch(err => {
          console.log('网络错误！'+err)
          this.$toast.error('网络异常')
        })
    },
    addPaper() {
      this.$router.push('/submit')
    },
    paperDetail(val) {
      this.$store.commit('setPaperInfo', val)
      this.$router.push('/paperInfo')
    },
    resetSearch() {
      this.pageInfo = Object.assign({}, this.defaultPageInfo)
      this.queryForm = {}
      this.getPaperList()
    },
    search () {
      this.pageInfo = Object.assign({}, this.defaultPageInfo)
      // setTimeout(() => this.searchLoading = false, 2000)
      this.getPaperList()
    },
    changePage(val){
      this.pageInfo.currentPage = val;
      this.getPaperList();
    },
  }
    

}
</script>

<style>

</style>