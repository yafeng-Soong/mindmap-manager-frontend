<template>
  <div class="fill-height ma-1">
    <paper-list-card 
      v-if="detailDialog"
      :dialog="detailDialog" 
      :tagInfo="tagInfo"
      @on-change-dialog="changeDialog">
    </paper-list-card>
    <combine-dialog 
      v-if="combineDialog"
      :dialog="combineDialog"
      :themeInfo="themeInfo"
      @on-change-dialog="changeCombineDialog">
    </combine-dialog>
    <v-card class="fill-height" width="100%" flat tile>
      <right-navigation 
        v-if="drawer"
        :drawer="drawer" 
        @on-change-drawer="changeDrawer"
        @recover-tag="getTagList">
      </right-navigation>
      <v-toolbar dense dark color="primary">
        <v-toolbar-title style="font-size: x-large">{{themeInfo.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <tip-icon
          icon="mdi-vector-combine"
          tip="合并到..."
          @click="combineDialog=true">
        </tip-icon>
        <tip-icon
          icon="mdi-dots-vertical"
          tip="更多操作"
          @click="drawer = !drawer">
        </tip-icon>
      </v-toolbar>
      <mindmap v-model="tagList" class="mindmap"
      :showUndo="false"
      @click="nodeClick(arguments)"
      @nodeAdd="nodeAdd(arguments)"
      @nodeDel="nodeDel"
      @nodeInsert="nodeInsert(arguments)"
      @nodeUpdateName="nodeUpdateName(arguments)"
      @reparent="reparent(arguments)"
      @move-1="move1"
      @move-2="move2(arguments)"></mindmap>
    </v-card>
  </div>
</template>

<script>
import mindmap from '@hellowuxin/mindmap'
import tagApi from '@/api/tagApi.js'
import PaperListCard from '@/components/paper/PaperListCard.vue'
import RightNavigation from '@/components/mindmap/RightNavigation.vue'
import TipIcon from "../../components/common/TipIcon.vue"
import CombineDialog from '../../components/mindmap/CombineDialog.vue'
// import paperApi from '@/api/paperApi.js'
export default {
  name: 'MindmapInfo',
  components: {
    mindmap, 
    PaperListCard,
    RightNavigation,
    TipIcon,
    CombineDialog,
  },
  data() {
    return {
      themeInfo: this.$store.getters.getThemeInfo,
      detailDialog: false,
      combineDialog: false,
      drawer: false,
      tagList: [],
      originList: [],
      paperList: [],
      tagInfo: {}
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
            console.log('获取数据异常' + res.data)
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
    findInnerNode(id) {
      const array = id.split('-').map(n => ~~n)
      let data = this.tagList[0]
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
      if (this.tagInfo.name !== '')
        that.detailDialog = true
    },
    nodeInsert(arg) {
      console.log('insert')
      console.log(arg[0])
      console.log(arg[1])
      console.log(arg[2])
      console.log('insert')
    },
    async nodeAdd(arg) {
      let id = arg[0]
      let tag = arg[1]
      let father = this.findNode(id)
      let param = {
        fatherId: father.tagId,
        left: father.left,
        name: tag.name
      }
      try {
        let res = await tagApi.addTag(param)
        if (res.code === 200)
          this.$toast.success('插入成功')
        else 
          this.$toast.error(res.data)
      } catch (err) {
        console.log(err)
        this.$toast.error('服务器异常')
      }
      this.getTagList()
    },
    async nodeUpdateName(arg) {
      let id = arg[0]
      let name = arg[1]
      let tagId = this.findNode(id).tagId
      let param = {
        tagId: tagId,
        name: name
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
      this.getTagList()
    },
    async nodeDel(val) {
      let id = this.findNode(val).tagId
      let param = {
        tagId: id
      }
      try {
        let res = await tagApi.removeTag(param)
        if (res.code === 200)
          this.$toast.success('删除成功')
        else 
          this.$toast.error(res.data)
      } catch (err) {
        console.log(err)
        this.$toast.error('服务器异常')
      }
      this.getTagList()
    },
    async reparent(arg) {
      // 移动节点
      let father = arg[0]
      let node = arg[1]
      let param = {
        fatherId: father.tagId,
        tagId: node.tagId
      }
      try {
        let res = await tagApi.reparentTag(param)
        if (res.code === 200)
          this.$toast.success('改变位置成功')
        else
          this.$toast.error(res.data)
      } catch (err) {
        console.log(err)
        this.$toast.error('服务器异常')
      }
      this.getTagList()
    },
    async move1(val) {
      // 改变节点左右顺序
      let param = {
        tagId: val.tagId
      } 
      try {
        let res = await tagApi.changePosition(param)
        if (res.code === 200)
          this.$toast.success('变换位置成功')
        else
          this.$toast.error(res.data)
      } catch (err) {
        console.log(err)
        this.$toast.error('服务器异常')
      }
      this.getTagList()
    },
    async move2(arg) {
      // 改变节点同层顺序，也可能改变左右顺序
      let node1 = arg[0]
      let node2 = arg[1]
      let param = {
        movedTagId: node1.tagId,
        insertTagId: node2.tagId,
        position: node2.left !== node1.left? true: false
      }
      try {
        let res = await tagApi.changeOrder(param)
        if (res.code === 200)
          this.$toast.success('改变顺序成功')
        else
          this.$toast.error(res.data)
      } catch (err) {
        console.log(err)
        this.$toast.error('服务器异常')
      }
      this.getTagList()
    },
    changeDialog(val) {
      this.detailDialog = val
    },
    changeCombineDialog(val) {
      this.combineDialog = val
    },
    changeDrawer(val) {
      this.drawer = val
    }
  }
  
}
</script>

<style lang="scss" scoped>
  .mindmap {
    height: 90%;
  }

</style>