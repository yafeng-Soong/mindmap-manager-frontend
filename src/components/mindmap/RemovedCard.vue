<template>
  <v-layout justify-center align-center>
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
          <!-- <v-btn
            color="error"
            text
            @click="remove"
          >
            删除
          </v-btn  > -->
          <progress-button
            :text="true"
            progressColor="error"
            color="error"
            title="删除"
            :disabled="loading"
            :loading="loading"
            @click="remove">
          </progress-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card class="ma-1" min-width="360" max-width="450">
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
          @click="dialog = true"
        >
          彻底删除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import themeApi from '@/api/themeApi.js'
import ProgressButton from '../../components/common/ProgressButton.vue'
export default {
  name:'RemovedCard',
  components: { ProgressButton },
  props: {
    themeInfo: {
      types: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      loading: false
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
    async remove() {
      this.loading = true
      try {
        let res = await themeApi.deleteTheme(this.themeInfo.id)
        if (res.code === 200) {
          this.$toast.success('删除成功')
          this.$emit('deleted')
        }
        else 
          this.$toast.error(res.data)
      } catch (err) {
        console.log(err)
        this.$toast.error('网络异常')
      }
      this.loading = false
      this.dialog = false
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