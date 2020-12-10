<template>
  <v-dialog v-model="dialog_" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">更新论文附件</span>
      </v-card-title>
      <v-card-text>
        <v-file-input
            v-model="file"
            outlined
            required
            show-size
            accept="application/msword, application/pdf, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            :rules="rules"
            label="点击上传论文附件">
        </v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog_=false">关闭</v-btn>
        <v-btn color="blue darken-1" text :disabled="updateDisable" @click="updateFile">更新</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import paperApi from '@/api/paperApi.js'
export default {
  props:{
    dialog: {
      types: Boolean,
      default: false
    },
    paperId: {
      types: Number,
      default: null
    }
  },
  data() {
    return {
      file: null,
      rules: [
        v => !!v || '文件必选',
        v => v.size / 1024 / 1024 < 15 || '文件不能超过15MB'
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
        this.$emit("on-change-file-dialog", val);
      }
    },
    updateDisable() {
      return this.file == null || this.file.size/1024/1024 > 15
    }
  },
  methods: {
    updateFile() {
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('paperId', this.paperId)
      paperApi.updateFile(formData)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success('更新成功')
            this.dialog_ = false
            this.$store.commit('setPaperInfo', res.data)
          } else this.$toast.error(res.msg)
        })
        .catch(err => {
          this.$toast.error('服务器异常')
          console.log(err)
        })
    }
  }
}
</script>

<style>

</style>