<template>
  <v-layout align-center justify-center>
    <v-flex xs8 sm8 md8> 
      <v-dialog v-model="dialog_" persistent max-width="800px">
        <v-card>
          <v-toolbar>
            <v-toolbar-title>{{tagInfo.name}} 相关文章</v-toolbar-title>
            <p class="ma-4">总计{{pageInfo.total}}篇</p>
            <v-spacer></v-spacer>
            <v-btn color="warning">锁定</v-btn>
            <v-btn class="ma-4" color="success" @click="submitPaper">新增</v-btn>
            <v-btn color="primary" @click="dialog_=false">关闭</v-btn>
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
              width="100">
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
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import Pagination from '@/components/common/Pagination.vue'
import paperApi from '@/api/paperApi.js'
export default {
    components: {Pagination},
    name: 'PaperListCard',
    props:{
      dialog: {
        types: Boolean,
        default: false
      },
      tagInfo: {
        types: Object,
        default: null
      },
      // paperList: {
      //   types: Array,
      //   default: []
      // }
    },
    data() {
      return {
        pageInfo: {
          currentPage: 1,
          pageSize: 5,
          total: 0,
          pages: 1
        },
        queryForm: {},
        paperList: [],
        tableHeaders: [
          {text: '#', value: 'id', sortable: false},
          {text: '标题', value: 'name', sortable: false},
          {text: '作者', value: 'author', sortable: false},
          {text: '关键字', value: 'keyword', sortable: false},
          {text: '发表年份', value: 'publishYear', sortable: false, width: '100px'}
        ]
      }
    },
    computed: {
      dialog_: {
        get() {
          return this.dialog;
        },
        set(val) {
          //drawer_改变由父组件控制
          this.$emit("on-change-dialog", val);
        }
      },
    },
    created() {
      this.getPaperList()
    },
    methods: {
      getPaperList() {
        let that = this
        this.queryForm.currentPage = this.pageInfo.currentPage
        this.queryForm.pageSize = this.pageInfo.pageSize
        this.queryForm.tagId = this.tagInfo.tagId
        paperApi.getPageListByTag(this.queryForm)
          .then(res => {
            // console.log(res.data)
            if (res.code === 200) {
              that.paperList = res.data.data
              that.pageInfo.pages = res.data.pages
              that.pageInfo.total = res.data.total
            }
            else {
              this.$toast.error(res.msg)
              console.log('获取论文列表失败'+res.msg);
            }
          })
          .catch(err => {
            this.$toast.error('网络异常')
            console.log('网络异常' + err)
          })
      },
      submitPaper() {
        this.$store.commit('setTagInfo', this.tagInfo)
        this.$router.push('/submit')
      },
      paperDetail(val) {
        this.$store.commit('setPaperInfo', val)
        this.$router.push('/paperInfo')
      },
      changePage(val){
        this.pageInfo.currentPage = val;
        this.getPaperList();
      },
    }
}
</script>

<style lang="scss" scoped>
</style>