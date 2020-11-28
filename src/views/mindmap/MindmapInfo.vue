<template>
  <v-container class="fill-height" fluid>
    <paper-list-card 
      v-if="detailDialog"
      :dialog="detailDialog" 
      :tagInfo="tagInfo"
      @on-change-dialog="changeDialog">
    </paper-list-card>
    <mindmap v-model="tagList" class="fill-height" 
    @click="nodeClick(arguments)" 
    @nodeMove="nodeMove(arguments)"
    @nodeAdd="nodeAdd(arguments)"
    @nodeInsert="nodeInsert(arguments)"
    @nodeUpdateName="nodeUpdateName(arguments)"></mindmap>
  </v-container>
</template>

<script>
import mindmap from '@hellowuxin/mindmap'
import tagApi from '@/api/tagApi.js'
import PaperListCard from '@/components/paper/PaperListCard.vue'
// import paperApi from '@/api/paperApi.js'
export default {
  name: 'MindmapInfo',
  components: {
    mindmap, 
    PaperListCard,
  },
  data() {
    return {
      themeInfo: this.$store.getters.getThemeInfo,
      detailDialog: false,
      tagList: [],
      originList: [],
      paperList: [],
      tagInfo: {},
      tagAddVo: {},
      tagRenameVo: {}
    }
  },
  mounted() {
    this.getTagList()
  },
  methods: {
    getTagList() {
      let that = this
      tagApi.getTree(this.themeInfo.id)
        .then(res => {
          if (res.code === 200) {
            that.tagList = res.data
            that.originList = res.data
          } else {
            this.$toast.err('获取数据异常')
            console.log('获取数据异常' + res.msg)
          }
        })
        .catch(err => {
          this.$toast.err('网络异常')
          console.log('网络异常' + err)
        })
    },
    findNode(id) {
      const array = id.split('-').map(n => ~~n)
      let data = this.originList[0]
      for (let i = 1; i < array.length; i++) {
        if (data && data.children) {
          data = data.children[array[i]]
        } else { // No data matching id
          break
        }
      }
      return data
    },
    nodeClick(arg) {
      let that = this
      const id = arg[1]
      this.tagInfo = this.findNode(id)
      that.detailDialog = true
    },
    nodeInsert(arg) {
      console.log('insert')
      console.log(arg[0])
      console.log(arg[1])
      console.log(arg[2])
      console.log('insert')
    },
    nodeAdd(arg) {
      let that = this
      let id = arg[0]
      let tag = arg[1]
      let father = this.findNode(id)
      this.tagAddVo.fatherId = father.id
      this.tagAddVo.left = father.left
      this.tagAddVo.name = tag.name
      this.tagAddVo.themeId = this.themeInfo.id
      tagApi.addTag(this.tagAddVo)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success('插入成功')
            that.getTagList()
          } else this.$toast.error(res.msg)
        })
        .catch(err => {
          console.log(err)
          this.$toast.error('服务器异常')
        })
    },
    nodeUpdateName(arg) {
      let that = this
      let id = arg[0]
      let name = arg[1]
      let tagId = this.findNode(id).id
      this.tagRenameVo.tagId = tagId
      this.tagRenameVo.name = name
      tagApi.renameTag(this.tagRenameVo)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success('重命名成功')
            that.getTagList()
          } else this.$toast.error(res.msg)
        })
        .catch(err => {
          console.log(err)
          this.$toast.error('服务器异常')
        })
    },
    changeDialog(val) {
      this.detailDialog = val
    }
  }
  
}
</script>

<style>

</style>