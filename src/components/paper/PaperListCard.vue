<template>
  <v-layout align-center justify-center>
    <v-flex xs8 sm8 md8> 
      <v-dialog v-model="updateDialog" persistent max-width="500">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>重命名结点</v-toolbar-title>
            <v-spacer></v-spacer>
            <tip-icon
            tip="关闭"
            icon="mdi-close"
            @click="updateDialog = false">
            </tip-icon>
          </v-toolbar>
          <v-card-text>
            <v-text-field class="ma-4"
              v-model="name"
              label="结点名称" 
              name="name"
              prepend-icon="mdi-format-title"
              required
              hint="请输入新的结点名称"
              type="text"
              :rules="nameRule"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <progress-button
              :text="true"
              title="更新"
              :disabled="updateDisable"
              :loading="loading"
              @click="updateName">
            </progress-button>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog_" persistent max-width="800px">
        <v-card>
          <v-toolbar>
            <v-toolbar-title>{{tagInfo.name}} 相关文章</v-toolbar-title>
            <p class="ma-4" style="min-width:80px">总计{{pageInfo.total}}篇</p>
            <v-spacer></v-spacer>
            <v-btn color="warning" @click="updateDialog = true">重命名</v-btn>
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
import TipIcon from "../common/TipIcon"
import ProgressButton from '../../components/common/ProgressButton.vue'
import tagApi from '@/api/tagApi.js'
export default {
    components: {
      Pagination,
      TipIcon,
      ProgressButton,
    },
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
        updateDialog: false,
        name: this.tagInfo.name,
        loading: false,
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
        ],
        nameRule: [
          v => !!v || '不能为空',
          v => v.length < 30 || '名称过长'
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
      updateDisable() {
        return this.loading || !this.name || this.name.length > 30
      }
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
              this.$toast.error(res.data)
              console.log('获取论文列表失败'+res.data);
            }
          })
          .catch(err => {
            this.$toast.error('网络异常')
            console.log('网络异常' + err)
          })
      },
      async updateName() {
        this.loading = true
        let param = {
          tagId: this.tagInfo.tagId,
          name: this.name
        }
        try {
          let res = await tagApi.renameTag(param)
          if (res.code === 200)
            this.$toast.success('重命名成功')
          else 
            this.$toast.error(res.data)
        } catch (err) {
          console.log(err)
          this.$toast.error('服务器异常')
        }
        this.loading = false
        this.updateDialog = false
        this.dialog_ = false
        // 通知父组件更新tagTree
        this.$emit('get-tag-list')
      },
      submitPaper() {
        this.$store.commit('setTagInfo', this.tagInfo)
        this.$router.push('/submit')
      },
      paperDetail(val) {
        this.$store.commit('setPaperInfo', val)
        this.$store.commit('setTagInfo', this.tagInfo)
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