<template>
  <div class="fill-height ma-4">
    <file-dialog 
      v-if="fileDialog"
      :dialog="fileDialog"
      :paperId="paperInfo.id"
      @on-change-file-dialog="changFileDialog">
    </file-dialog>
    <v-card>
      <v-toolbar  dark color="primary">
        <v-toolbar-title style="font-size: x-large">{{paperInfo.name}}</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-col cols="2">
          <v-text-field
            outlined
            disabled
            label="发表年份" 
            :value="paperInfo.publishYear">
          </v-text-field>
        </v-col>
        <v-col cols="8">
          <v-text-field
            outlined
            disabled
            label="作者" 
            :value="paperInfo.author">
          </v-text-field>
        </v-col>
        <v-col cols="10">
          <v-text-field
            outlined
            disabled
            label="关键字"
            :value="paperInfo.keyword">
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            outlined
            disabled
            label="文章摘要"
            :value="paperInfo.abstracts">
          </v-textarea>
        </v-col>
      </v-container>
      <v-card-actions>
        <v-layout justify-center>
          <v-btn class="ma-4" color="success" @click="fileDialog=true">更新附件</v-btn>
          <v-btn class="ma-4" color="primary" @click="go">查看附件</v-btn>
          <v-btn class="ma-4" color="error" @click="deletePaper">删除论文</v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import FileDialog from '@/components/paper/FileDialog.vue'
import paperApi from '@/api/paperApi.js'
export default {
  name:'PaperInfo',
  components: {FileDialog},
  data() {
    return {
      paperInfo: this.$store.getters.getPaperInfo,
      tagInfo: this.$store.getters.getTagInfo,
      fileDialog: false
    }
  },
  computed: {
    baseUrl() {
      return this.$store.getters.getBaseUrl
    },
    filePath() {
      return this.$store.getters.getPaperInfo.filePath
    }
  },
  destroyed() {
    this.$store.commit('deleteTagInfo')
  },
  methods: {
    go() {
      const src = this.baseUrl + this.filePath
      window.open(src, '_blank')
    },
    changFileDialog(val) {
      this.paperInfo = this.$store.getters.getPaperInfo
      this.fileDialog = val
    },
    async deletePaper() {
      console.log(this.paperInfo.id)
      if (this.tagInfo == null)
        console.log('直接删除')
      try {
        let res
        if (this.tagInfo == null)
          res = await paperApi.deletePaper(this.paperInfo.id)
        else {
          let param = {
            paperId: this.paperInfo.id,
            tagId: this.tagInfo.tagId
          }
          res = await paperApi.deletePaperFromTag(param)
        }
        if (res.code === 200) {
          this.$toast.success('删除成功')
          this.$router.go(-1)
        } else this.$toast.error(res.msg)
      } catch (err) {
        console.log(err)
        this.$toast.error('删除失败，网络异常')
      }
      // let that = this
      // paperApi.deletePaper(that.paperInfo.id)
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.$toast.success('删除成功')
      //       this.$router.go(-1)
      //     } else {
      //       console.log('删除论文失败')
      //       this.$toast.error(res.msg)
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err)
      //     this.$toast.error('删除失败，网络异常')
      //   })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .v-input--is-disabled {
    color: rgba(0,0,0,.87);
  }
  ::v-deep .v-input--is-disabled input {
    color: rgba(0,0,0,.87);
  }
  ::v-deep .v-input--is-disabled textarea {
    color: rgba(0,0,0,.87);
  }
</style>