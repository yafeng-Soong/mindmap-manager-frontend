<template>
  <div>
    <mindmap-add-dialog 
      v-if="dialog"
      :dialog="dialog"
      :isAdd="isAdd"
      :themeInfo="themeInfo"
      @on-change-dialog="changeDialog">
    </mindmap-add-dialog>
    <v-card class="ma-1">
      <v-card-text>
        <div>于 {{themeInfo.createTime}} 创建</div>
        <p class="display-1 text--primary single-text">
          {{themeInfo.name}}
        </p>
        <p>创建者 {{themeInfo.creator}}</p>
        <p>最后更新于 {{themeInfo.updateTime}}</p>
        <div class="text--primary single-text">
          {{themeInfo.description}}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="orange"
          @click="detail"
        >
          查看详情
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="edit"
        >
          修改信息
        </v-btn>
        <v-btn 
          text 
          color="error"
          @click="remove">
          删除
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import themeApi from '@/api/themeApi.js'
import MindmapAddDialog from '@/components/mindmap/MindmapAddDialog.vue'
export default {
  name:'MindmapCard',
  components: {
    MindmapAddDialog
  },
  props: {
    themeInfo: {
      types: Object,
      default: null
    }
  },
  data() {
    return {
      isAdd: false,
      dialog: false,
    }
  },
  methods: {
    detail() {
      // this.$emit('detail-click', this.themeInfo)
      this.$store.commit('setThemeInfo', this.themeInfo)
      this.$router.push('/mindmapInfo')
    },
    edit() {
      // this.$emit('edit-click', this.themeInfo)
      this.dialog = true
    },
    remove() {
      themeApi.removeTheme(this.themeInfo.id)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success('删除成功，已归档到回收站')
            this.$emit('removed')
          } else this.$toast.error(res.msg)
        })
        .catch(err => {
          console.log(err)
          this.$toast.error('网络异常')
        })
    },
    changeDialog(val) {
      this.dialog = val
      this.$emit('changed')
    }
  }
}
</script>

<style>
  .single-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>