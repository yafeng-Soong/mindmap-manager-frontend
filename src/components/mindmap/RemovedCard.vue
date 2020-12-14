<template>
  <div>
    <v-dialog
      v-model="dialog"
      width="500">
      <v-card>
        <v-toolbar dark color="red lighten-2">
          <v-card-title>
            确定要彻底删除？
          </v-card-title>
        </v-toolbar>

        <v-card-text class="display-1 text--primary">
          彻底删除后无法找回，并且与脑图相关的论文数据也会被删除，请谨慎操作
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="dialog = false"
          >
            删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card class="ma-1">
      <v-card-text>
        <div>于 {{themeInfo.updateTime}} 删除</div>
        <p class="display-1 text--primary single-text">
          {{themeInfo.name}}
        </p>
        <div class="text--primary single-text">
          {{themeInfo.description}}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="success"
          @click="recover"
        >
          还原
        </v-btn>
        <v-btn
          text
          color="error"
          @click="remove"
        >
          彻底删除
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import themeApi from '@/api/themeApi.js'
export default {
  name:'RemovedCard',
  props: {
    themeInfo: {
      types: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    recover() {
      themeApi.recoverTheme(this.themeInfo.id)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success('恢复成功')
            this.$emit('recovered')
          } else this.$toast.error(res.data)
        })
        .catch(err => {
          console.log(err)
          this.$toast.error('网络异常')
        })
    },
    remove() {
      this.dialog = true
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