<template>
  <div class="fill-height">
    <v-card flat tile>
      <v-toolbar  dark color="primary">
        <v-toolbar-title style="font-size: x-large">我的脑图</v-toolbar-title>
        <div class="ma-4">总计{{themeList.length}}个</div>
        <v-spacer></v-spacer>
        <v-text-field
          hide-details
          single-line
          prepend-inner-icon="mdi-feature-search"
          placeholder="查找"
          style="width: 10px"
        ></v-text-field>
        <v-btn icon title="投稿"><v-icon>mdi-plus-circle</v-icon></v-btn>
      </v-toolbar>
      <v-container fluid class="grey lighten-4">
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="item in themeList" :key="item.id">
            <v-card>
              <v-card-text>
                <div>于 {{item.createTime}} 创建</div>
                <p class="display-1 text--primary">
                  {{item.name}}
                </p>
                <p>创建者 {{item.creator}}</p>
                <div class="text--primary">
                  {{item.description}}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="orange"
                  @click="detail(item)"
                >
                  查看详情
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="grey lighten-4">
        <v-layout justify-center>
          <pagination
          :currentPage="pageInfo.pageNum"
          :total="pageInfo.pages" @on-change-page="changePage"></pagination>
        </v-layout>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Pagination from '@/components/common/Pagination.vue'
import themeApi from '@/api/themeApi.js'
export default {
  name: 'MyMindmap',
  components: {
    Pagination
  },
  data(){
    return {
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
        pages: 1
      },
      themeList: []
    }
  },
  created() {
    this.getList()
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
    detail(param) {
      this.$store.commit('setThemeInfo', param)
      // console.log(this.$store.getters.getThemeInfo)
      this.$router.push('/mindmapInfo')
      // this.$router.push('/helloWorld')
    }

  }
}
</script>

<style scoped>

</style>
